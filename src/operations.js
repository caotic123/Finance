import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { connect } from "react-redux"
import { Icon, Input, Button, Overlay, Divider, CheckBox } from 'react-native-elements'
import { ListItem } from 'react-native-elements'
import {createOperation} from "./ultils/connection"
import { useFocusEffect } from '@react-navigation/native';
import { getBanks } from "./ultils/redux/actions"
import Bar from "./bar"
import Box from "./ultils/components/box"
import {Dialog} from "./ultils/components/dialog"
import {Loader} from "./ultils/components/loader"
import { compose } from 'redux';

function RegisterOperations({ user, navigation, banks, getBanks }) {

  const [inputs, set_inputs] = useState({description : "", value : ""})
  const [type, set_type_operation] = useState("incoming")
  const [bank, set_bank] = useState(null)
  const [msg_error, set_msg_error] = useState({visible : false, msg : ""})
  const [wait, set_waiting] = useState(false)
  const future_callback = useRef()

  useFocusEffect(React.useCallback(() => {
    //cancela o callback caso o usuario saia da tela
    return () => {
      future_callback.current = null
    }
  }, []))

  const send_msg = (msg) => {
    set_msg_error({visible : true, msg : msg})
  }

  useFocusEffect(React.useCallback(() => {
    getBanks(user)
  }, []))

  return (<View>
    <Bar />
    <Input
      leftIcon={
        <Text style={{ fontSize: 16 }}>
          Descrição :
      </Text>
      } 
      onChangeText = {text => set_inputs(prev => ({...prev, description : text}))}
      value = {inputs.description}/>
    <Input
      placeholder={"0.00"}
      keyboardType={"numeric"}
      leftIcon={
        <Text style={{ fontSize: 16 }}>
          Valor :
      </Text>
      }
      onChangeText = {text => set_inputs(prev => ({...prev, value : text}))}
      value = {inputs.value} />

    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <CheckBox
        title='Incoming'
        checked={type == "incoming"}
        size={40}
        onPress={() => set_type_operation("incoming")}
        containerStyle={{ backgroundColor: "rgba(5, 245, 29, 0.5)" }}
      />

      <CheckBox
        title='Outcoming'
        checked={type == "outcoming"}
        size={40}
        onPress={() => set_type_operation("outcoming")}
        containerStyle={{ backgroundColor: "rgba(244, 11, 11, 0.59)" }}
      />
    </View>
    <Divider style={{ height: 2 }} />

    <Box status={banks} style={{ height: "40%", margin : "3%" }} boxing={(list) => <FlatList
      data={list}
      renderItem={({ item }) =>
        <CheckBox
          center
          title={item.name}
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          onPress = {() => set_bank(item.id)}
          checked={bank != null && bank == item.id}
        />
      }
      keyExtractor={item => item.id.toString()}
    />} error_msg={"Você não tem nenhuma conta de banco"} />

  <Button title = {"Cadastrar"} containerStyle = {{padding : "2%"}} onPress = {() => {
    if (inputs.description.length <= 2) {
      send_msg("Você deve digitar com pelo menos 3 caracteres")
      return;
    }

    if (inputs.value.length <= 0 || parseFloat(inputs.value) == NaN) {
      send_msg("Você deve colocar um valor")
      return;
    }

    if (bank == null) {
      send_msg("Você deve selecionar um banco para criar uma operação")
      return;
    }

    set_waiting(true)
    future_callback.current = () => navigation.navigate("Main")
    createOperation(user,
        {description : inputs.description, type : type, value : parseFloat(inputs.value), bank : bank},
        (x) => {
          if (future_callback.current != null) {
            future_callback.current()
          }
        }, () => {
         // provavelmente problemas de conexão, podemos ignorar desde que não atualiza o redux
        })
 
  }}>

  </Button>

  <Dialog status = {msg_error} onPress = {() => set_msg_error({visible : false})}/>
  <Loader status = {wait}/>
  </View>)
}

const mapStateToProps = ({ user, banks }) => ({ user, banks });
const mapDispatchToProps = { getBanks };

export default connect(mapStateToProps, mapDispatchToProps)(RegisterOperations);
