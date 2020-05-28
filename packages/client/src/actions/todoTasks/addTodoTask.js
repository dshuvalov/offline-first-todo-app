// @flow

import { toast } from 'react-toastify'
import { idb } from '../../controllers/idb'
import { httpClient } from '../../controllers/httpClient'
import type {
  Dispatch,
  AddTodoTaskAction,
  ChangeTodoTaskAction,
  TodoTask,
} from '../../controllers/GlobalStateProvider'
import { ADD_TODO_TASK, CHANGE_TODO_TASK } from './actionTypes'

export const addTodoTask = async (
  todoTask: TodoTask,
  dispatch: Dispatch<AddTodoTaskAction | ChangeTodoTaskAction>,
) => {
  const { pushIDBValue, changeIDBValue } = idb

  try {
    const idbPushResponse = await pushIDBValue('TodoTasks', todoTask)

    if (idbPushResponse.status === 'success') {
      dispatch({ type: ADD_TODO_TASK, payload: todoTask })
      toast.success('Task was successfully created')
    }

    const { meta, ...body } = todoTask
    const fetchResponse = await httpClient.post('/task', { body })

    if (fetchResponse.status === 200) {
      const synchronizedTodoTask = {
        ...todoTask,
        meta: { ...todoTask.meta, isSynchronized: true },
      }

      const idbChangeResponse = await changeIDBValue('TodoTasks', synchronizedTodoTask)

      if (idbChangeResponse.status === 'success') {
        dispatch({
          type: CHANGE_TODO_TASK,
          payload: {
            todoTaskId: todoTask.id,
            value: synchronizedTodoTask,
          },
        })
      }
    } else {
      toast.warn(
        'Internal Server Error. Task saved to the local database. Please contact to support team',
        {
          autoClose: 10000,
        },
      )
    }
  } catch (error) {
    toast.error('Task do not saved. Please contact to support team')
    throw error
  }
}
