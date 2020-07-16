import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { connect } from "react-redux"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon, Input, Button, Overlay } from 'react-native-elements'
import { useDispatch } from 'react-redux';
import { useRef } from 'react';
import { client } from "./connection"

function Register(props) {

  const [register, set_input] = useState({ user: "", password: "", email: "" })

  const try_register = (r, error) =>
    client.post("auth/local/register", {
        username: register.user,
        email: register.email,
        password: register.password
    }).then(() => r()).catch(err => error(err.response.data))

  return (
    <View style={styles.container}>
      <Text style={{ color: "white", fontSize: 20, padding: 20 }}>
        Cadastre seus dados
      </Text>
      <View style={{ width: "80%" }}>
        <Input
          placeholder="Username"
          inputStyle={{ color: "white" }}
          onChangeText={text => {
            set_input(prev => ({ ...prev, user: text }))
          }}
          leftIcon={
            <Icon
              name="user"
              type="antdesign"
              size={24}
              color='black'
            />
          }
        />
        <Input
          placeholder="Email"
          inputStyle={{ color: "white" }}
          onChangeText={text => {
            set_input(prev => ({ ...prev, email: text }))
          }}
          leftIcon={
            <Icon
              name='email-outline'
              type="material-community"
              size={24}
              color='black'
            />
          }
        />
        <Input
          placeholder="Senha"
          inputStyle={{ color: "white" }}
          onChangeText={text => {
            set_input(prev => ({ ...prev, password: text }))
          }}
          leftIcon={
            <Icon
              name='lock'
              type="antdesign"
              size={24}
              color='black'
            />
          }
        />

        <Button title={"Registrar"} onPress={() => 
          try_register(() => {
            console.log("aeow")
          }, (err) => {
            console.log(err)
          })
        }/>

      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: "rgba(1, 21, 101, 0.7)"
  }
});

const mapStateToProps = ({ }) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Register);


