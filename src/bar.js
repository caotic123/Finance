import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Header, Icon } from 'react-native-elements'
import { connect } from "react-redux"
import {logout} from "./ultils/navigation"

function Bar({user : {user}}) {
  
  return (
  <Header
    placement="left"
    leftComponent={{ icon: 'user', type : 'entypo', color: '#fff' }}
    centerComponent={<Text style = {{fontSize : 20, color : "white"}}>
      Bem vindo de volta, {user.username}.
    </Text>}
    rightComponent={
      <Icon 
        name = 'logout'
        type = 'antdesign'
        color = '#fff' 
        onPress = {logout}
      />
     }
   
    />
  
  )
}

const mapStateToProps = ({ user }) => ({ user});
const mapDispatchToProps = {  };

export default connect(mapStateToProps, mapDispatchToProps)(Bar);

