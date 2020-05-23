// @flow

import type { TodoTask } from '../GlobalStateProvider'

// type IDBObjectStoreName = 'TodoTasks'

type IDBTransactionSuccessResponse<D> = Promise<{| +status: 'success', data: D |}>
type IDBTransactionErrorResponse<E> = Promise<{| +status: 'error', error: E |}>

type InitIDBFn = () => IDBTransactionSuccessResponse<null> | IDBTransactionErrorResponse<Error>

type GetAllIDBFn = (
  'TodoTasks',
) => IDBTransactionSuccessResponse<Array<TodoTask>> | IDBTransactionErrorResponse<Error>

type PushIDBValueFn = (
  'TodoTasks',
  value: TodoTask,
) => IDBTransactionSuccessResponse<null> | IDBTransactionErrorResponse<Error>

type ChangeIDBValueFn = (
  'TodoTasks',
  value: TodoTask,
) => IDBTransactionSuccessResponse<null> | IDBTransactionErrorResponse<Error>

type DeleteIDBValueFn = (
  'TodoTasks',
  key: string,
) => IDBTransactionSuccessResponse<null> | IDBTransactionErrorResponse<Error>

export type { InitIDBFn, GetAllIDBFn, PushIDBValueFn, ChangeIDBValueFn, DeleteIDBValueFn }
