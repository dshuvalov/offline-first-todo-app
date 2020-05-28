// @flow

import type { TodoTask, TodoTaskMeta } from '../../controllers/GlobalStateProvider'

export type TodoTaskServerSide = $Rest<TodoTask, {| meta: TodoTaskMeta |}>
