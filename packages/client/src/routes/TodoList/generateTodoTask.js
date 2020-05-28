// @flow

import { nanoid } from 'nanoid'
import { type TodoTask } from '../../controllers/GlobalStateProvider'

export const generateTodoTask = (title: string, orderNumber: number): TodoTask => {
  return {
    id: nanoid(),
    title,
    description: '',
    orderNumber,
    isCompleted: false,
    meta: {
      isSynchronized: false,
      reason: 'create',
    },
  }
}
