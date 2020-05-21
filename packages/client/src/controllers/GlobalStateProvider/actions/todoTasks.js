// @flow

import { idb } from '../../idb'
import { FETCH_TODO_TASKS, SET_TODO_TASKS, ADD_TODO_TASK } from '../actionTypes/todoTasks'

import type {
  Dispatch,
  FetchTodoTasksAction,
  SetTodoTasksAction,
  AddTodoTaskAction,
} from '../types/GlobalStateProvider'
import type { TodoTask } from '../types/entities'

export const fetchTodoTasks = async (
  dispatch: Dispatch<FetchTodoTasksAction | SetTodoTasksAction>,
) => {
  const { getAll } = idb
  try {
    dispatch({ type: FETCH_TODO_TASKS, payload: null })
    const result = await getAll('TodoTasks')
    if (result && result.data) {
      return dispatch({ type: SET_TODO_TASKS, payload: result.data })
    }
    return dispatch({ type: SET_TODO_TASKS, payload: [] })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const addTodoTask = async (todoTask: TodoTask, dispatch: Dispatch<AddTodoTaskAction>) => {
  const { pushIDBValue } = idb

  try {
    await pushIDBValue('TodoTasks', todoTask)
    dispatch({ type: ADD_TODO_TASK, payload: todoTask })
  } catch (error) {
    console.log(error)
    throw error
  }
}

// type ReturnActionValueGeneric<T, P> = {| type: T, payload: P |}

// type RemoveTodoTaskActionProps = {| todoTaskId: string, todoTaskIndex: number |}
// type RemoveTodoTaskAction = RemoveTodoTaskActionProps => ReturnActionValueGeneric<
//   '@todos/REMOVE_TODO_TASK',
//   RemoveTodoTaskActionProps,
// >

// export const removeTodoTask = () => {}

// export const createTodoTasksActions: ITodoTasksActions = () => {
//   return {
//     addTodo: todoTask => {
//       return {
//         type: ADD_TODO_TASK,
//         payload: todoTask,
//       }
//     },
//     removeTodo: removeTodoProps => {
//       return {
//         type: REMOVE_TODO_TASK,
//         payload: removeTodoProps,
//       }
//     },
//   }
// }
