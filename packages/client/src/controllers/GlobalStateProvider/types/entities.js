// @flow

export type TodoTaskMeta = {|
  isSynchronized: boolean,
  reason: 'create' | 'delete' | 'update',
|}

export type TodoTask = {|
  id: string,
  title: string,
  description: string,
  orderNumber: number,
  isCompleted: boolean,
  meta: TodoTaskMeta,
|}
