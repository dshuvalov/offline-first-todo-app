// @flow

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, type ContextRouter } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import { changeTodoTask } from '../../actions'
import { Input } from '../../components/Input'
import {
  useGlobalStateProvider,
  type TodoTask as TodoTaskType,
} from '../../controllers/GlobalStateProvider'
import './TodoTask.css'

const defaultTask = {
  id: '',
  title: '',
  description: '',
  orderNumber: 0,
  isCompleted: false,
  meta: { isSynchronized: false, reason: 'create' },
}

export const TodoTask = React.memo<ContextRouter>(props => {
  const [todoTitle, setTodoTitle] = useState<string>('')
  const [todoDescription, setTodoDescription] = useState<string>('')
  const {
    state: { todoTasks },
    dispatch,
  } = useGlobalStateProvider()

  const currentTodo = useMemo<TodoTaskType>(() => {
    const { taskId } = props.match.params
    const foundTask = todoTasks.find(todoTask => todoTask.id === taskId) || defaultTask

    return foundTask
  }, [props.match, todoTasks])

  useEffect(() => {
    setTodoTitle(currentTodo.title)
    setTodoDescription(currentTodo.description)
  }, [currentTodo.description, currentTodo.title])

  const handleChangeTitle = useCallback(event => {
    const newTitle = event.target.value

    setTodoTitle(newTitle)
  }, [])
  const handleChangeDescription = useCallback(event => {
    const newDescription = event.target.value

    setTodoDescription(newDescription)
  }, [])

  const handleSaveTask = useCallback(() => {
    changeTodoTask({ ...currentTodo, title: todoTitle, description: todoDescription }, dispatch)
  }, [currentTodo, dispatch, todoDescription, todoTitle])

  return (
    <div className="TodoTask__block">
      <Input
        className="TodoTask__input"
        value={todoTitle}
        placeholder="Todo title"
        onChange={handleChangeTitle}
      />
      <Link to="/">
        <div className="TodoTask__exit-icon" />
      </Link>
      <TextareaAutosize
        className="TodoTask__textarea"
        minRows={3}
        value={todoDescription}
        onChange={handleChangeDescription}
      />
      <button className="TodoTask__save-button" onClick={handleSaveTask}>
        Save
      </button>
    </div>
  )
})
