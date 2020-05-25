// @flow

import type { TodoTask } from './entities'

type GlobalStateProviderState = {|
  todoTasks: Array<TodoTask>,
|}

type ActionGeneric<T, P> = {| type: T, payload: P |}

type FetchTodoTasksAction = ActionGeneric<'@todos/FETCH_TODO_TASKS', null>
type SetTodoTasksAction = ActionGeneric<'@todos/SET_TODO_TASKS', Array<TodoTask>>
type AddTodoTaskAction = ActionGeneric<'@todos/ADD_TODO_TASK', TodoTask>
type ChangeTodoTaskAction = ActionGeneric<
  '@todos/CHANGE_TODO_TASK',
  {| pathToValue: $ReadOnlyArray<string | number>, value: mixed |},
>
type RemoveTodoTaskAction = ActionGeneric<
  '@todos/REMOVE_TODO_TASK',
  {| todoTaskRemovableId: string |},
>

type GlobalStateProviderActions =
  | FetchTodoTasksAction
  | SetTodoTasksAction
  | AddTodoTaskAction
  | ChangeTodoTaskAction
  | RemoveTodoTaskAction

type Dispatch<A: GlobalStateProviderActions> = A => void

export type {
  GlobalStateProviderState,
  FetchTodoTasksAction,
  SetTodoTasksAction,
  AddTodoTaskAction,
  ChangeTodoTaskAction,
  RemoveTodoTaskAction,
  GlobalStateProviderActions,
  Dispatch,
}
