import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { connect } from "react-redux"
import { Icon, Input, Button, Overlay, Divider, CheckBox } from 'react-native-elements'
import { ListItem } from 'react-native-elements'
import { createOperation } from "./ultils/connection"
import { useFocusEffect } from '@react-navigation/native';
import { getBanks } from "./ultils/redux/actions"
import Bar from "./bar"
import Box from "./ultils/components/box"
import { Dialog } from "./ultils/components/dialog"
import { Loader } from "./ultils/components/loader"
import { set } from 'react-native-reanimated';

const SCREENS_STATUS = {
  INITIAL: 1,
  TRANSITION_SCREEN: 2,
  END: 3
}

function RegisterOperations({ user, navigation, banks, getBanks }) {

  const transference = useRef({ sender: null, reciever: null })
  const value = useRef()
  const screen_status = useRef(SCREENS_STATUS.INITIAL)
  const screen_interface = useRef()
  const future_callback = useRef()
  const [msg, set_msg] = useState({ visible: false, msg: "" })


  useFocusEffect(React.useCallback(() => {
    return () => {
      // cancela o evento caso o usuario saia da tela
      future_callback.current = null
    }
  }, []))

  const goToScreen = (screen) => {
    screen_interface.current(screen)
  }

  const send_msg = (msg) => {
    set_msg({ visible: true, msg: msg })
  }

  const INITIAL_SCREEN = () => {
    const [value, set_value] = useState("")
    const [sender, set_sender] = useState(null)

    return (
      <View style={{ justifyContent: "center", height: "100%", width: "100%", alignItems: "center" }}>

        <Text style={{ fontSize: 18 }}>
          Digite o valor que você quer transferir
        </Text>
        <Input
          placeholder={"0.00"}
          keyboardType={"numeric"}
          leftIcon={
            <Text style={{ fontSize: 16 }}>
              Valor :
        </Text>
          }
          onChangeText={set_value}
          value={value} />

        <Text style={{ fontSize: 18 }}>
          Escolha o banco de onde quer transferir
        </Text>
        <Box status={banks} style={{ height: "18%", margin: "3%" }} boxing={(list) => <FlatList
          data={list}
          renderItem={({ item }) =>
            <CheckBox
              center
              title={item.name + " (ID : " + item.id + ")"}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              onPress={() => set_sender(item.id)}
              checked={sender != null && sender == item.id}
            />
          }
          keyExtractor={item => item.id.toString()}
        />} error_msg={"Você não tem nenhuma conta de banco"} />

        <Icon
          reverse
          name='rightcircleo'
          type='antdesign'
          color='#517fa4'
          onPress={() => {

            if (value.length < 1 || parseFloat(value) == NaN) {
              send_msg("Preencha os dados de valor")
              return;
            }

            if (sender == null) {
              send_msg("Escolha um conta antes de continuar")
              return;
            }

            transference.current.sender = sender
            transference.current.value = value
            goToScreen(SCREENS_STATUS.TRANSITION_SCREEN)
          }}
        />
      </View>)
  }

  const TRANSITION_SCREEN = () => {

    useState(() => {
      let id = setTimeout(() => {
        goToScreen(SCREENS_STATUS.END)
      }, 3000)

      return () => {
        clearInterval(id)
      }
    }, [])
    return (
      <View style={{ justifyContent: "center", height: "100%", width: "100%", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>
          Escolha agora uma conta
        </Text>
        <Text style={{ padding: 10 }}>
          Para seu dinheiro ser transferido
        </Text>
        <Loader actived={true} />
      </View>
    )
  }


  const END_SCREEN = () => {
    const [reciever, set_reciver] = useState(null)

    return (
      <View style={{ justifyContent: "center", height: "100%", width: "100%", alignItems: "center" }}>
        <Text style={{ fontSize: 18 }}>
          Escolha agora a conta que ira receber
        </Text>
        <Box status={{ loaded: banks.loaded, list: banks.list.filter(({ id }) => id != transference.current.sender) }} style={{ height: "18%", margin: "3%" }} boxing={(list) => <FlatList
          data={list}
          renderItem={({ item }) =>
            <CheckBox
              center
              title={item.name + " (ID : " + item.id + ")"}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              onPress={() => set_reciver(item.id)}
              checked={reciever != null && reciever == item.id}
            />
          }
          keyExtractor={item => item.id.toString()}
        />} error_msg={"Você não tem nenhuma conta de banco"} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Icon
            reverse
            name='leftcircleo'
            type='antdesign'
            color='#517fa4'
            onPress={() => {
              goToScreen(SCREENS_STATUS.INITIAL)
            }}
          />
          <Icon
            reverse
            name='checkcircle'
            type='antdesign'
            color='#517fa4'
            onPress={() => {
              if (reciever == null) {
                send_msg("Escolha um banco para receber o valor antes")
              }

              transference.current.reciever = reciever
              future_callback.current = () => navigation.navigate("Main")
              createOperation(user,
                { description: "Transferência de conta", type: "outcoming", value: transference.current.value, bank: transference.current.sender },
                (x) => {

                  createOperation(user,
                    { description: "Transferência de conta", type: "incoming", value: transference.current.value, bank: transference.current.reciever },
                    (x) => {
                      if (future_callback.current != null) {
                        future_callback.current()
                      }
                    }, () => { })
                }, () => {
                  // provavelmente problemas de conexão, podemos ignorar desde que não atualiza o redux
                })

            }}

          />
        </View>

      </View>
    )
  }


  const Actual_screen = (props) => {
    const { screen_status, screen_interface } = props
    const [screen, setScreen] = useState(screen_status)

    useEffect(() => {
      screen_interface.current = setScreen
    }, [])

    switch (screen) {
      case SCREENS_STATUS.INITIAL:
        return <INITIAL_SCREEN />
      case SCREENS_STATUS.TRANSITION_SCREEN:
        return <TRANSITION_SCREEN />
      case SCREENS_STATUS.END:
        return <END_SCREEN />
      default:
        return (null)
    }
  }

  return (
    <View>
      <Bar />
      <Actual_screen screen_status={screen_status.current} screen_interface={screen_interface} />
      <Dialog status={msg} onPress={() => set_msg({ visible: false })} />
    </View>)
}

const mapStateToProps = ({ user, banks }) => ({ user, banks });
const mapDispatchToProps = { getBanks };

export default connect(mapStateToProps, mapDispatchToProps)(RegisterOperations);
