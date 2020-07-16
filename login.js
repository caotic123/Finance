import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { connect } from "react-redux"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon, Input, Button, Overlay } from 'react-native-elements'
import { insert_login } from './actions'
import { useDispatch } from 'react-redux';
import { useRef } from 'react';
import {validError} from "./connection"
import {Loader} from "./loader"

function Login(props) {
  const { insert_login, user_info: { login_info } } = props
  const [state, set_error_msg] = useState({ visible: false, msg: "" })
  const [actived, set_status] = useState(false)
  const dispatch = useDispatch();

  const [login_input, set_input] = useState({ user: "", password: "" })
  // console.log(login_info.sucess, !login_info.sucess, login_info != null ? !login_info.sucess : false)
  return (
    <View style={styles.container}>

      <Loader actived = {actived}/>
      <Text style={styles.logo}>
        Logo here
         </Text>
      <View style={styles.container_login}>

        <View style={{ width: "100%", backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          <Text style={{ margin: 10, color: "white", fontWeight: "bold" }}>
            Continue com seus dados pessoais
        </Text>
          <Input
            placeholder="Usuario"
            inputStyle={{ color: "white" }}
            onChangeText={text => {
              set_input(prev => ({ ...prev, user: text }))
            }}
            leftIcon={
              <Icon
                name='user'
                type="antdesign"
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
        </View>
        <Button
          title="Entrar"
          titleStyle={{ color: "white" }}
          buttonStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          type="outline"
          icon={
            <Icon
              name="enter-outline"
              type="ionicon"
              size={22}
              color="white"
              containerStyle={{ padding: 4 }}
            />
          }
          containerStyle={{ padding: 10 }}
          onPress={() => {

            if (actived) { return; }

            const validateInput = (where) => {
              if (where(login_input).length < 1) {
                set_error_msg({ visible: true, msg: "Por favor insira um(a) " + (where({user : "usuario", password : "senha"}) + " valido") })
                return false;
              }
              return true;
            }

            if (validateInput(obj => obj.user) && validateInput(obj => obj.password)) {
              set_error_msg(prev => ({ ...prev, visible: false }))
              set_status(true)
              insert_login({
                ...login_input,
                onSucess: (data) => {
                  set_status(false)
                  return true
                }, onFail: (res) => {
                  set_status(false)

                  validError(res, () => {
                    set_error_msg({ visible: true, msg: "Servidor não encontrado"})
                  }, (msgs) => {
                    set_error_msg({ visible: true, msg : msgs})
                  })
                }
              })
            }
          }}
        />
      </View>

      <Overlay
        isVisible={state.visible}
        overlayBackgroundColor={"rgba(255, 255, 255, 0.8)"}
        width="auto"
        height="auto"
      >
        <View style>
          <Icon
            name='sms-failed'
            type="materialIcons"
            size={24}
            color='black'
          />
          <Text>
            {state.msg}
          </Text>
          <Button title={"Okay"} onPress={() => {

            set_error_msg(prev => ({ ...prev, visible: false }
            ))
          }} />
        </View>
      </Overlay>

    </View>
  )
}

const styles = StyleSheet.create({
  logo: {
    top: '30%',
    position: 'absolute'
  },

  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: "rgba(1, 21, 101, 0.7)"
  },

  container_login: {
    position: "absolute",
    top: "40%",
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = ({ user_info }) => ({ user_info });
const mapDispatchToProps = { insert_login };

export default connect(mapStateToProps, mapDispatchToProps)(Login);


