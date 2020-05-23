// @flow

import React, { Fragment, useState, useCallback, useMemo } from 'react'
// $FlowFixMe
import { nanoid } from 'nanoid'
import {
  useGlobalStateProvider,
  type TodoTask,
  addTodoTask,
} from '../../controllers/GlobalStateProvider'
import { Input } from '../../components/Input'
import { TodoListItem } from './TodoListItem'

import './TodoList.css'

const generateTodoTask = (title, orderNumber): TodoTask => {
  return {
    id: nanoid(),
    title,
    description: '',
    orderNumber,
    isCompleted: false,
  }
}

export const TodoList = React.memo<null>(function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('')
  const { state, dispatch } = useGlobalStateProvider()

  const todoTasks = useMemo(() => state.todoTasks, [state])
  const todoTasksCount = useMemo(() => todoTasks.length, [todoTasks])

  const handleChangeTodoTitle = useCallback(event => {
    const { value } = event.target
    setNewTodoTitle(value)
  }, [])

  const addNewTodo = useCallback(
    event => {
      const trimmedNewTodoTitle = String(newTodoTitle).trim()
      if (event.which === 13 && trimmedNewTodoTitle.length !== 0) {
        const newTodoTask = generateTodoTask(trimmedNewTodoTitle, todoTasksCount)
        setNewTodoTitle('')
        addTodoTask(newTodoTask, dispatch)
      }
    },
    [dispatch, newTodoTitle, todoTasksCount],
  )

  return (
    <Fragment>
      <header className="TodoList__header">
        <Input
          className="TodoList__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleChangeTodoTitle}
          onKeyDown={addNewTodo}
        />
      </header>
      <main className="TodoList__main">
        <ul className="TodoList__list">
          {todoTasks.map((todo, index) => (
            <TodoListItem
              key={todo.id}
              id={todo.id}
              index={index}
              todoTitle={todo.title}
              isTodoCompleted={todo.isCompleted}
            />
          ))}
        </ul>
      </main>
    </Fragment>
  )
})
