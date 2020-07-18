import React, {useRef} from "react"
import { createStore, applyMiddleware } from "redux"
import axiosMiddleware from 'redux-axios-middleware';
import { client } from "./connection"

export const container = React.createRef()

function createStoreByState(initial_state) {
  const friendReducer = (state = {...initial_state, 
    banks : {loaded : false, list : []},
    operations : {loaded : false, list : []}
  }, action) => {
    switch (action.type) {
      case 'GET_BANKS':
        return {...state, banks : {loaded : false, list : []}}
      case 'GET_OPERATIONS':
          return {...state, operations : {loaded : false}}
      case 'GET_BANKS_SUCCESS':
        return {...state, banks : {loaded : true, list : action.payload.data}}
        case 'GET_BANKS_FAIL':
          return {...state, banks : {loaded : false}}
        case 'GET_OPERATIONS_SUCCESS':
          return {...state, operations : {loaded : true, list : action.payload.data}}
        case 'GET_OPERATIONS_FAIL':
          return {...state, operations : {loaded : false}}
      default:
        return state
    }
  };
  return createStore(friendReducer, applyMiddleware(
    axiosMiddleware(client)))
}

export const setReduxContainer = (state) => {
    container.current = createStoreByState(state)
}