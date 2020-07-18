import { StyleSheet } from 'react-native';
import React from 'react';
import Login from "./login"
import Register from "./register"
import Init from "./init"
import {navigation} from "./navigation"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

const App: () => React$Node = () => {
  return (
      <NavigationContainer ref = {navigation}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="Register"
            component={Register}
          />
         <Stack.Screen
            name="Init"
            component={Init}
            options = {{
              headerShown : false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  )
};

export default App;
