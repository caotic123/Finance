import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image } from 'react-native';
import { Icon, Input, Button, Overlay, ButtonGroup } from 'react-native-elements'
import { validError, client, do_login } from "./connection"
import { Loader } from "./loader"
import { Dialog } from "./dialog"
import { useFocusEffect } from '@react-navigation/native';
import { enter_login, isDataSaved, isSensorAvaliable, checkLocalUserID } from "./navigation"

export default function Login(props) {
  const { navigation } = props
  const [state, set_error_msg] = useState({ visible: false, msg: "" })
  const [actived, set_status] = useState(false)

  const [login_input, set_input] = useState({ user: "", password: "" })
  useFocusEffect(React.useCallback(() => {
    (async () => {
      const data = await isDataSaved()
      if (data != null && await checkLocalUserID()) {
        set_input(JSON.parse(data))
      }
    })();
  }, []))


  // Isso não é nada seguro, mas por meios simplorios funciona, uma adptação seria encryptar os dados
  // com a chave do fingerpint

  return (
    <View style={styles.container}>
      <Loader actived={actived}/>
      <Image
        style={{height : "20%", width : "30%", margin : "10%"}}
        source={{
          uri: 'https://i.ibb.co/d7zwzq7/Logo-Makr-7a7xy-G.png',
        }}
      />
      
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
            value={login_input.user}
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
            secureTextEntry={true}
            onChangeText={text => {
              set_input(prev => ({ ...prev, password: text }))
            }}
            value={login_input.password}
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
        <View style={{ flex: 0, flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            title="Entrar"
            titleStyle={{ color: "white" }}
            buttonStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            containerStyle={{ padding: 6 }}
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

            onPress={() => {

              //Se estiver esperando uma requisição simplesmente não requisite nova
              if (actived) { return; }

              const validateInput = (where) => {
                if (where(login_input).length < 1) {
                  set_error_msg({ visible: true, msg: "Por favor insira um(a) " + (where({ user: "usuario", password: "senha" }) + " valido") })
                  return false;
                }
                return true;
              }

              // Valida os inputs 
              if (validateInput(obj => obj.user) && validateInput(obj => obj.password)) {
                set_error_msg(prev => ({ ...prev, visible: false }))
                set_status(true)
                do_login(login_input,
                  async (data) => {
                    set_status(false)
                    enter_login(login_input, data)
                  }, (res) => {
                    //Login Falho
                    set_status(false)
                    // Verifica se há resposta para o erro, se não o erro é devido a falta de alcance ao servidor
                    validError(res, () => {
                      set_error_msg({ visible: true, msg: "Servidor não encontrado" })
                    }, (msgs) => {
                      //Se tiver msgs de erros do servidor apenas mostre-a para o usuario
                      set_error_msg({ visible: true, msg: msgs })
                    })
                  }
                )
              }
            }}

          />
          <Button
            title="Registrar"
            titleStyle={{ color: "white" }}
            containerStyle={{ padding: 6 }}
            buttonStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            type="outline"
            onPress={() => {
              navigation.navigate("Register")
            }}
            icon={
              <Icon
                name="enter-outline"
                type="ionicon"
                size={22}
                color="white"
                containerStyle={{ padding: 4 }}
              />
            } />
            
        </View>
      </View>
  
      <Dialog status={state} onPress={() => {
        set_error_msg(prev => ({ ...prev, visible: false }))
      }} />


    </View >
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
    width : "80%",
    
    alignItems: 'center',
    justifyContent: 'center',
  },
});

