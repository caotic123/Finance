import { StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Main from "./main"
import Operations from "./operations"
import Transferences from "./transfer"
import {container} from "./store"
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App({ navigation, route }) {
  return (
    <Provider store={container.current}>
      <Tab.Navigator>
        <Tab.Screen
          name="Main"
          component={Main}
          
        />
        <Tab.Screen
          name="Operations"
          component={Operations}
        />
        <Tab.Screen
          name="Transferencer"
          component={Transferences}
        />

      </Tab.Navigator>
    </Provider>
  )
};


