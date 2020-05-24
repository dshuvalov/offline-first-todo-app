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
import { SET_TODO_TASKS } from './actionTypes'
import type { TodoTaskServerSide } from './types'

const sortByOrderNumber = (a: TodoTask, b: TodoTask) => {
  const aOrder = a.orderNumber
  const bOrder = b.orderNumber

  if (aOrder > bOrder) return 1
  if (aOrder < bOrder) return -1
  return 0
}

const getServerSideData = (clientTodoTask: TodoTask): TodoTaskServerSide => {
  const { meta, ...payload } = clientTodoTask
  return payload
}

const findTodoTaskById = (todoTasks: Array<TodoTask>, id: string): TodoTask | void => {
  return todoTasks.find(task => task.id === id)
}

const syncCreatedTodoTasks = async (
  unSyncCreatedTodoTasks: Array<TodoTask>,
): Promise<Array<TodoTask>> => {
  const { changeIDBValue } = idb

  try {
    // Synchronize tasks with backend
    const createdTasksResponses = await Promise.all(
      unSyncCreatedTodoTasks.map(todoTask =>
        httpClient.post('/task', { body: getServerSideData(todoTask) }),
      ),
    )

    const syncCreatedTasks: Array<TodoTask> = []
    const unSyncCreatedTasks: Array<TodoTask> = []

    // Generate list of successfully synchronized tasks
    createdTasksResponses.forEach((response, index) => {
      if (response && response.status === 200) {
        const todoTask = {
          ...unSyncCreatedTodoTasks[index],
          meta: { reason: 'create', isSynchronized: true },
        }
        syncCreatedTasks.push(todoTask)
        return
      }

      const todoTask = unSyncCreatedTodoTasks[index]
      unSyncCreatedTasks.push(todoTask)
    })

    // Save successfully synchronized tasks to Indexed Database
    await Promise.all(syncCreatedTasks.map(syncTask => changeIDBValue('TodoTasks', syncTask)))

    return [...syncCreatedTasks, ...unSyncCreatedTasks]
  } catch (error) {
    toast.error('Error')
    throw error
  }
}

export const syncTodoTasks = async (
  todoTasks: Array<TodoTask>,
  dispatch: Dispatch<FetchTodoTasksAction | SetTodoTasksAction>,
) => {
  try {
    toast.info('You have unsaved task. They will be synchronized to the server at the background')
    const unSyncCreatedTodoTasks: Array<TodoTask> = []
    // const unSyncUpdatedTodoTasks = []
    // const unSyncDeletedTodoTasks = []

    todoTasks.forEach(task => {
      if (task.meta.reason === 'create' && !task.meta.isSynchronized) {
        unSyncCreatedTodoTasks.push(task)
      }
    })

    const synchronizedCreatedTodoTasks = await syncCreatedTodoTasks(unSyncCreatedTodoTasks)
    const newTodoTasks: Array<TodoTask> = todoTasks.reduce((accum, todoTask) => {
      const { id } = todoTask

      const synchronizedCreatedTodoTask = findTodoTaskById(synchronizedCreatedTodoTasks, id)
      if (synchronizedCreatedTodoTask) {
        return [...accum, { ...synchronizedCreatedTodoTask }]
      }

      return [...accum, { ...todoTask }]
    }, [])
    console.log(
      'beforeSynced',
      todoTasks.filter(task => task.meta.isSynchronized),
    )
    console.log('syncCreatedTasks', synchronizedCreatedTodoTasks)
    console.log('after sync', newTodoTasks)

    return dispatch({ type: SET_TODO_TASKS, payload: newTodoTasks.sort(sortByOrderNumber) })
  } catch (error) {
    toast.error('Task do not synchronized. Please contact to support team')
    throw error
  }
}
