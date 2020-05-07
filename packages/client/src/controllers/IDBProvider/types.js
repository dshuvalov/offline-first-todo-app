// @flow

type TodoTask = {|
  id: string,
  title: string,
  description: string,
  isCompleted: boolean,
|}

type IDBProviderValues = {|
  todoTasks: Array<TodoTask>,
|}

type PathToValueOrArray = $ReadOnlyArray<string | number>

type IDBObjectStoreName = 'TodoTasks'

export type { TodoTask, IDBProviderValues, PathToValueOrArray, IDBObjectStoreName }
