import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { Icon, Input, Button, Overlay, Divider } from 'react-native-elements'

// Uma box é um eficiente componente para controlar carregamento e visualização de grandes dados
export default function Box(props) {
    const { style, status: { loaded, list }, boxing, error_msg } = props

    // Se estiver carregando...
    if (!loaded) {
      return (<ActivityIndicator color="rgba(200, 40, 30, 0.8)" size={60} />)
    }

    // Se a lista estiver vazia carregue o componente de erro da box 
    if (list.length < 1) {
      return (<View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, color: "black" }}>
          {error_msg}
        </Text>
        <Icon
          name='frowno'
          type='antdesign'
          color='#517fa4'
          size={60}
          containerStyle={{ padding: 10 }}
        />
      </View>)
    }

    return (
      <View style={{ ...style, borderWidth: loaded ? 0 : 2, borderColor: "black" }}>
        {
          boxing(list)
        }
      </View>)
  }
