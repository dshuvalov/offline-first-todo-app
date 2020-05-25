// @flow

import React, { useReducer } from 'react'

import {
  ADD_TODO_TASK,
  SET_TODO_TASKS,
  CHANGE_TODO_TASK,
  REMOVE_TODO_TASK,
} from '../../actions/todoTasks'
import { pushValueByPath, changeValueByPath, removeValueByPath } from './utils'
import { GlobalStateProviderContext } from './GlobalStateProviderContext'
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
    case SET_TODO_TASKS: {
      const newState = changeValueByPath(state, ['todoTasks'], action.payload)
      return { ...newState }
    }
    case ADD_TODO_TASK: {
      const newState = pushValueByPath(state, ['todoTasks'], action.payload)
      return { ...newState }
    }
    case CHANGE_TODO_TASK: {
      const { pathToValue, value } = action.payload
      const newState = changeValueByPath(state, ['todoTasks', ...pathToValue], value)
      return { ...newState }
    }
    case REMOVE_TODO_TASK: {
      const { todoTaskRemovableId } = action.payload
      const todoTaskRemovableIndex = state.todoTasks
        .map(todoTask => todoTask.id)
        .indexOf(todoTaskRemovableId)

      if (todoTaskRemovableIndex !== -1) {
        const newState = removeValueByPath(state, ['todoTasks'], todoTaskRemovableIndex)
        return { ...newState }
      }
      return state
    }
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
