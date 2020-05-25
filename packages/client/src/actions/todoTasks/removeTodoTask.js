// @flow

import { toast } from 'react-toastify'
import { idb } from '../../controllers/idb'
import { httpClient } from '../../controllers/httpClient'
import type {
  Dispatch,
  RemoveTodoTaskAction,
  ChangeTodoTaskAction,
  TodoTask,
} from '../../controllers/GlobalStateProvider'
import { REMOVE_TODO_TASK } from './actionTypes'

export const removeTodoTask = async (
  todoTask: TodoTask,
  dispatch: Dispatch<RemoveTodoTaskAction | ChangeTodoTaskAction>,
) => {
  const { changeIDBValue, deleteIDBValue } = idb

  try {
    if (!todoTask.meta.isSynchronized) {
      const idbDeleteResponse = await deleteIDBValue('TodoTasks', todoTask.id)

      if (idbDeleteResponse.status === 'success') {
        dispatch({
          type: REMOVE_TODO_TASK,
          payload: {
            todoTaskRemovableId: todoTask.id,
          },
        })
        toast.success('Task was successfully deleted')
      }
      return
    }
    const idbChangeResponse = await changeIDBValue('TodoTasks', {
      ...todoTask,
      meta: { reason: 'delete', isSynchronized: false },
    })

    if (idbChangeResponse.status === 'success') {
      dispatch({
        type: REMOVE_TODO_TASK,
        payload: { todoTaskRemovableId: todoTask.id },
      })
      toast.success('Task was successfully deleted')
    }

    const fetchResponse = await httpClient.delete('/task', { body: { todoTaskId: todoTask.id } })

    if (fetchResponse.status === 200) {
      deleteIDBValue('TodoTasks', todoTask.id)
    } else {
      toast.warn(
        'Internal Server Error. Task do not deleted from database. Please contact to support team',
        {
          autoClose: 10000,
        },
      )
    }
  } catch (error) {
    toast.error('Task do not deleted. Please contact to support team')
    throw error
  }
}
