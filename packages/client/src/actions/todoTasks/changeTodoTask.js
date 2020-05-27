// @flow

import { toast } from 'react-toastify'
import { idb } from '../../controllers/idb'
import { httpClient } from '../../controllers/httpClient'
import type {
  Dispatch,
  ChangeTodoTaskAction,
  TodoTask,
} from '../../controllers/GlobalStateProvider'
import { CHANGE_TODO_TASK } from './actionTypes'

export const changeTodoTask = async (
  todoTask: TodoTask,
  dispatch: Dispatch<ChangeTodoTaskAction>,
) => {
  const { changeIDBValue } = idb

  try {
    if (!todoTask.meta.isSynchronized) {
      const idbChangeResponse = await changeIDBValue('TodoTasks', todoTask)

      if (idbChangeResponse.status === 'success') {
        dispatch({
          type: CHANGE_TODO_TASK,
          payload: { todoTaskId: todoTask.id, value: todoTask },
        })
      }
      return
    }

    const unSynchronizedTodoTask = {
      ...todoTask,
      meta: { reason: 'update', isSynchronized: false },
    }

    const idbChangeResponse = await changeIDBValue('TodoTasks', unSynchronizedTodoTask)

    if (idbChangeResponse.status === 'success') {
      dispatch({
        type: CHANGE_TODO_TASK,
        payload: { todoTaskId: todoTask.id, value: unSynchronizedTodoTask },
      })
    }

    const { meta, ...body } = todoTask
    const fetchResponse = await httpClient.put('/task', { body })

    if (fetchResponse.status === 200) {
      const synchronizedTodoTask = {
        ...todoTask,
        meta: { ...todoTask.meta, isSynchronized: true },
      }

      const idbResponse = await changeIDBValue('TodoTasks', synchronizedTodoTask)

      if (idbResponse.status === 'success') {
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
        'Internal Server Error. Updates saved to the local database. Please contact to support team',
        {
          autoClose: 10000,
        },
      )
    }
  } catch (error) {
    toast.error('Updates do not saved. Please contact to support team')
    throw error
  }
}
