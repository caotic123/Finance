import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { connect } from "react-redux"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon, Input, Button, Overlay } from 'react-native-elements'
import { useDispatch } from 'react-redux';
import { useRef } from 'react';
import { client, validError } from "./connection"
import { Dialog } from "./dialog"
import {Loader} from "./loader"

function Register(props) {

  const {navigation} = props
  const [register, set_input] = useState({ user: "", password: "", email: "" })
  const [status_msg, set_msg] = useState({ visible: false, msg: "" })

  const send_msg = (msg) => {
    set_msg(prev => ({ visible: true, msg: msg }))
  }

  const try_register = (r, error) =>
    client.post("auth/local/register", {
      username: register.user,
      email: register.email,
      password: register.password
    }).then(() => r()).catch(err => error(err))

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

        <Button title={"Registrar"} containerStyle = {{padding : 10}} onPress={() =>
         
          try_register(() => {
            send_msg("Conta criada com sucesso")
          }, (err) => {

            validError(err, () => {
              send_msg("Servidor inalcançável")
            }, (err) => {
              send_msg(err)
            })
          })
        } />

        <Button title={"Logar?"} containerStyle = {{padding : 10}} onPress={() =>
          navigation.navigate("Login") 
        }/>

      </View>

      <Dialog status={status_msg} onPress={() =>
        set_msg(prev => ({ ...prev, visible: false }))
      } />

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


