// @flow

import { toast } from 'react-toastify'
import { idb } from '../../controllers/idb'
import { httpClient } from '../../controllers/httpClient'
import type {
  Dispatch,
  FetchTodoTasksAction,
  SetTodoTasksAction,
  TodoTask,
} from '../../controllers/GlobalStateProvider'
import { FETCH_TODO_TASKS, SET_TODO_TASKS } from './actionTypes'
import { syncTodoTasks } from './syncTodoTasks'
import type { TodoTaskServerSide } from './types'

const sortByOrderNumber = (a: TodoTask, b: TodoTask) => {
  const aOrder = a.orderNumber
  const bOrder = b.orderNumber

  if (aOrder > bOrder) return 1
  if (aOrder < bOrder) return -1
  return 0
}

export const fetchTodoTasks = async (
  dispatch: Dispatch<FetchTodoTasksAction | SetTodoTasksAction>,
) => {
  const { getAll, pushIDBValue } = idb
  try {
    dispatch({ type: FETCH_TODO_TASKS, payload: null })

    const [idbResponse, fetchResponse] = await Promise.all([
      getAll('TodoTasks'),
      // $FlowFixMe
      httpClient.get('/tasks'),
    ])

    if (idbResponse && idbResponse.data && fetchResponse.status === 200) {
      const { data: idbTasks } = idbResponse

      // If there are no local data at the Indexed Database, then will save data from backend as initial
      if (idbTasks.length === 0) {
        // Map initial data from backend for the Indexed database client side logic
        const clientSideTodoTasks: Array<TodoTask> = fetchResponse.body.map(
          (todoTask: TodoTaskServerSide) => ({
            ...todoTask,
            meta: {
              isSynchronized: true,
              meta: 'create',
            },
          }),
        )

        // Generate array from promises which add values to the Indexed Database at the async way
        const idbPushValuePromises = clientSideTodoTasks.map(todoTask =>
          pushIDBValue('TodoTasks', {
            ...todoTask,
          }),
        )
        await Promise.all([idbPushValuePromises])

        return dispatch({
          type: SET_TODO_TASKS,
          payload: clientSideTodoTasks.sort(sortByOrderNumber),
        })
      }

      // Generate array from non synchronized tasks at the backend side
      const isUnSynchronizedTodoTasksExists = idbResponse.data.some(todoTask => {
        if (!todoTask.meta.isSynchronized) return true
        return false
      })

      if (isUnSynchronizedTodoTasksExists) {
        syncTodoTasks(idbResponse.data, dispatch)
      }

      // Filter deleted todoTasks
      const filteredTodoTasks = idbResponse.data.filter(todoTask => {
        if (todoTask.meta.reason !== 'delete') return true
        return false
      })

      return dispatch({
        type: SET_TODO_TASKS,
        payload: filteredTodoTasks.sort(sortByOrderNumber),
      })
    } else if (idbResponse && idbResponse.data) {
      toast.warn(
        'Something get wrong with server. Initial data get from local database. Please contact to support team',
        {
          autoClose: 10000,
        },
      )

      const filteredTodoTasks = idbResponse.data.filter(todoTask => {
        if (todoTask.meta.reason !== 'delete') return true
        return false
      })
      return dispatch({ type: SET_TODO_TASKS, payload: filteredTodoTasks.sort(sortByOrderNumber) })
    }

    return dispatch({ type: SET_TODO_TASKS, payload: [] })
  } catch (error) {
    toast.error('Internal Server Error. Please contact to support team', {
      autoClose: 10000,
    })
    throw error
  }
}
