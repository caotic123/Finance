import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Overlay, Icon, Button } from 'react-native-elements'

export const Dialog = (props) => {
  const status = props.status
  
  return (<Overlay
    isVisible={status.visible}
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
        {status.msg}
      </Text>
      <Button title={"Okay"} onPress={props.onPress} />
    </View>
  </Overlay>)
}