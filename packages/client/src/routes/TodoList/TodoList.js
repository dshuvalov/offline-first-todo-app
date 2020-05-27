// @flow

import React, { Fragment, useState, useCallback, useMemo } from 'react'
import { useGlobalStateProvider, type TodoTask } from '../../controllers/GlobalStateProvider'
import { addTodoTask, removeTodoTask, changeTodoTask } from '../../actions'
import { Input } from '../../components/Input'
import { TodoListItem } from './TodoListItem'
import { generateTodoTask } from './generateTodoTask'
import './TodoList.css'

export const TodoList = React.memo<null>(function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('')
  const {
    state,
    state: { todoTasks },
    dispatch,
  } = useGlobalStateProvider()

  const lastOrderNumber = useMemo(() => {
    const todoTasksCount = state.todoTasks.length
    const lastTask = state.todoTasks[todoTasksCount - 1]

    if (lastTask) {
      return lastTask.orderNumber + 1
    }
    return todoTasksCount
  }, [state])

  const handleChangeTodoTitle = useCallback(event => {
    const { value } = event.target
    setNewTodoTitle(value)
  }, [])

  const addNewTodo = useCallback(
    event => {
      const trimmedNewTodoTitle = String(newTodoTitle).trim()
      if (event.which === 13 && trimmedNewTodoTitle.length !== 0) {
        const newTodoTask = generateTodoTask(trimmedNewTodoTitle, lastOrderNumber)
        setNewTodoTitle('')
        addTodoTask(newTodoTask, dispatch)
      }
    },
    [dispatch, newTodoTitle, lastOrderNumber],
  )

  const handleRemoveTodoTask = useCallback(
    (todoTask: TodoTask) => {
      removeTodoTask(todoTask, dispatch)
    },
    [dispatch],
  )

  const handleCompleteTodoTask = useCallback(
    (todoTask: TodoTask, isCompleted: boolean) => {
      changeTodoTask({ ...todoTask, isCompleted }, dispatch)
    },
    [dispatch],
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
          {todoTasks.map(todo => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              removeTodoTask={handleRemoveTodoTask}
              completeTodoTask={handleCompleteTodoTask}
            />
          ))}
        </ul>
      </main>
    </Fragment>
  )
})
