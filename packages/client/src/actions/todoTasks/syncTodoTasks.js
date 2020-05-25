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

    // Generate list of successfully and unsuccessfully synchronized tasks
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

const syncDeletedTodoTasks = async (unSyncDeletedTodoTasks: Array<TodoTask>) => {
  const { deleteIDBValue } = idb

  try {
    // Synchronize tasks with backend
    const createdTasksResponses = await Promise.all(
      unSyncDeletedTodoTasks.map(todoTask =>
        httpClient.delete('/task', { body: { todoTaskId: todoTask.id } }),
      ),
    )

    const syncDeletedTasks: Array<TodoTask> = []
    const unSyncDeletedTasks: Array<TodoTask> = []

    // Generate list of successfully and unsuccessfully synchronized tasks
    createdTasksResponses.forEach((response, index) => {
      if (response && response.status === 200) {
        const todoTask = {
          ...unSyncDeletedTodoTasks[index],
          meta: { reason: 'delete', isSynchronized: true },
        }
        syncDeletedTasks.push(todoTask)
        return
      }

      const todoTask = unSyncDeletedTasks[index]
      unSyncDeletedTasks.push(todoTask)
    })

    // Remove successfully synchronized tasks from Indexed Database
    await Promise.all(syncDeletedTasks.map(syncTask => deleteIDBValue('TodoTasks', syncTask.id)))

    return [...syncDeletedTasks, ...unSyncDeletedTasks]
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
    const unSyncDeletedTodoTasks = []
    // const unSyncUpdatedTodoTasks = []

    todoTasks.forEach(task => {
      if (task.meta.reason === 'create' && !task.meta.isSynchronized) {
        unSyncCreatedTodoTasks.push(task)
      }
      if (task.meta.reason === 'delete' && !task.meta.isSynchronized) {
        unSyncDeletedTodoTasks.push(task)
      }
    })

    const synchronizedCreatedTodoTasks = await syncCreatedTodoTasks(unSyncCreatedTodoTasks)
    const synchronizedDeletedTodoTasks = await syncDeletedTodoTasks(unSyncDeletedTodoTasks)

    const newTodoTasks: Array<TodoTask> = todoTasks.reduce((accum, todoTask) => {
      const { id } = todoTask

      const synchronizedCreatedTodoTask = findTodoTaskById(synchronizedCreatedTodoTasks, id)
      if (synchronizedCreatedTodoTask) {
        return [...accum, { ...synchronizedCreatedTodoTask }]
      }

      const synchronizedDeletedTodoTask = findTodoTaskById(synchronizedDeletedTodoTasks, id)
      if (synchronizedDeletedTodoTask && !synchronizedDeletedTodoTask.meta.isSynchronized) {
        return [...accum, { ...synchronizedDeletedTodoTask }]
      } else if (synchronizedDeletedTodoTask && synchronizedDeletedTodoTask.meta.isSynchronized) {
        return [...accum]
      }

      return [...accum, { ...todoTask }]
    }, [])
    console.log('beforeSync', todoTasks)
    console.log(
      'already sync',
      todoTasks.filter(task => task.meta.isSynchronized),
    )
    console.log('syncCreatedTasks', synchronizedCreatedTodoTasks)
    console.log('syncDeletedTasks', synchronizedDeletedTodoTasks)
    console.log('after sync', newTodoTasks)

    return dispatch({ type: SET_TODO_TASKS, payload: newTodoTasks.sort(sortByOrderNumber) })
  } catch (error) {
    toast.error('Task do not synchronized. Please contact to support team')
    throw error
  }
}
