import React from "react"
import AsyncStorage from '@react-native-community/async-storage';
import { setReduxContainer } from "./store"
import ReactNativeBiometrics from 'react-native-biometrics'

export const navigation = React.createRef()

export const saveLogin = async (data) => {
    await AsyncStorage.setItem('@key', JSON.stringify(data))
}

export const isDataSaved = () => AsyncStorage.getItem("@key")

export const isSensorAvaliable = () => new Promise(resolve =>
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
        const { available, biometryType } = resultObject

        return resolve(available)
    }).catch(() => resolve(false)))

export const checkLocalUserID = () => new Promise(resolve =>
    ReactNativeBiometrics.simplePrompt({ promptMessage: 'Confirme seu fingerprint' })
        .then((resultObject) => {
            const { success } = resultObject
            if (success) {
                return resolve(true)
            } else {
                return resolve(false)
            }
        })
        .catch(() => {
            return resolve(false)
        }))

export const enter_login = (login_input, data) => {
    if (navigation.current != null) {
        saveLogin(login_input)
        // cria um novo redux store e inicializa o estado com os dados do usuario
        setReduxContainer({ user: data.data })
        navigation.current.navigate("Init")
    }
}

export const logout = () => {
    if (navigation.current != null) {
        navigation.current.navigate("Login")
    }
}

