import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

export const Loader = (props) => {
  const actived = props.actived
  const style = props.style ? props.style : {}
  return (actived ?
    <ActivityIndicator size={60} color="rgba(200, 40, 30, 0.8)" containerStyle={{...style, position: "absolute", top: "50%" }} />
    : null)
}