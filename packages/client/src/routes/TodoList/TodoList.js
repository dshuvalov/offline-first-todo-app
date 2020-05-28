// @flow

import React, { Fragment, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalStateProvider, type TodoTask } from '../../controllers/GlobalStateProvider'
import { addTodoTask, removeTodoTask, changeTodoTask } from '../../actions'
import { Input } from '../../components/Input'
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

  const handleCompleteTodoTask = useCallback(
    (todoTask: TodoTask) => (event: SyntheticInputEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked
      changeTodoTask({ ...todoTask, isCompleted: isChecked }, dispatch)
    },
    [dispatch],
  )

  const handleRemoveTodoTask = useCallback(
    (todoTask: TodoTask) => () => {
      removeTodoTask(todoTask, dispatch)
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
          {todoTasks.map(todo => {
            return (
              <li key={todo.id}>
                <input
                  className="TodoList__item-toggle"
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={handleCompleteTodoTask(todo)}
                />
                <Link to={`/task/${todo.id}`} className="TodoList__item-title">
                  {todo.title}
                </Link>
                <button className="TodoList__item-remove" onClick={handleRemoveTodoTask(todo)} />
              </li>
            )
          })}
        </ul>
      </main>
    </Fragment>
  )
})
