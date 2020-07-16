import { StyleSheet } from 'react-native';
import React from 'react';
import Login from "./login"
import Register from "./register"
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axiosMiddleware from 'redux-axios-middleware';
import {client} from "./connection"

const Tab = createBottomTabNavigator();

const INITIAL_STATE = {
  user_info: { onSuccess: null, onFail: null },
  register_info :  { onSuccess: null, onFail: null }
};

const friendReducer = (state = INITIAL_STATE, action) => {

  // Checa se a message tem o campo valido de messagens, se sim adiciona ao estado como erro, se não sucesso
  const checkCreditialsData = data => {
    return data.message != null ?
      ({ sucess: false, msg: data.message.messages.map(({ message }) => message).join(",") })
      : ({ sucess: true })
  }

  switch (action.type) {
    case 'INSERT_LOGIN':
      return { ...state, user_info: { ...state.user_info, ...action.payload.events } }
    case "INSERT_LOGIN_FAIL":
      return { ...state, user_info: { sucess: state.user_info.onFail(action) } }
    case "INSERT_LOGIN_SUCCESS":
      return { ...state, user_info: { sucess: state.user_info.onSucess(action) } }
    default:
      return state
  }
};

const store = createStore(friendReducer, applyMiddleware(
  axiosMiddleware(client), //second parameter options can optionally contain onSuccess, onError, onComplete, successSuffix, errorSuffix
))

const App: () => React$Node = () => {
  return (

    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Login"
            initialParams={
              { test: "a" }
            }
            component={Login}

          />
          <Tab.Screen
            name="Register"
            component={Register}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  )
};

export default App;
