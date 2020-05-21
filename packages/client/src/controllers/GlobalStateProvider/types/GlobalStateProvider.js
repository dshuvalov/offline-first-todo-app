// @flow

import type { TodoTask } from './entities'

type GlobalStateProviderState = {|
  todoTasks: Array<TodoTask>,
|}

type ActionGeneric<T, P> = {| type: T, payload: P |}

type FetchTodoTasksAction = ActionGeneric<'@todos/FETCH_TODO_TASKS', null>
type SetTodoTasksAction = ActionGeneric<'@todos/SET_TODO_TASKS', Array<TodoTask>>
type AddTodoTaskAction = ActionGeneric<'@todos/ADD_TODO_TASK', TodoTask>
type RemoveTodoTaskAction = ActionGeneric<'@todos/REMOVE_TODO_TASK', {| todoTaskIndex: number |}>

type GlobalStateProviderActions =
  | FetchTodoTasksAction
  | SetTodoTasksAction
  | AddTodoTaskAction
  | RemoveTodoTaskAction

type Dispatch<A: GlobalStateProviderActions> = A => void

export type {
  GlobalStateProviderState,
  FetchTodoTasksAction,
  SetTodoTasksAction,
  AddTodoTaskAction,
  RemoveTodoTaskAction,
  GlobalStateProviderActions,
  Dispatch,
}
