// @flow

import React, { useReducer } from 'react'

import { pushValueByPath, changeValueByPath } from './utils'
import { GlobalStateProviderContext } from './GlobalStateProviderContext'
import { ADD_TODO_TASK, SET_TODO_TASKS } from './actionTypes/todoTasks'
import type {
  GlobalStateProviderState,
  GlobalStateProviderActions,
} from './types/GlobalStateProvider'

type Props = {|
  children: React$Node,
|}

const initialState = {
  todoTasks: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_TODO_TASK: {
      const newState = pushValueByPath(state, ['todoTasks'], action.payload)
      console.log('ADD_TODO_TASK', newState)
      return { ...newState }
    }
    case SET_TODO_TASKS: {
      const newState = changeValueByPath(state, ['todoTasks'], action.payload)
      console.log('SET_TODO_TASKS', newState)
      return { ...newState }
    }
    // case REMOVE_TODO_TASK:
    //   return { count: state.count - 1 }
    default:
      return state
  }
}

export const GlobalStateProvider = (props: Props) => {
  const [state, dispatch] = useReducer<GlobalStateProviderState, GlobalStateProviderActions>(
    reducer,
    initialState,
  )

  return (
    <GlobalStateProviderContext.Provider value={{ state, dispatch }}>
      {props.children}
    </GlobalStateProviderContext.Provider>
  )
}
