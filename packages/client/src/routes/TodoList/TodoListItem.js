// @flow

import React, { useCallback } from 'react'
import { type TodoTask } from '../../controllers/GlobalStateProvider'

type Props = {|
  todo: TodoTask,
  removeTodoTask: (todoTask: TodoTask) => void,
  completeTodoTask: (todoTask: TodoTask, isCompleted: boolean) => void,
|}

export const TodoListItem = React.memo<Props>(function TodoListItem(props) {
  const handleRemoveTodoTask = useCallback(() => {
    props.removeTodoTask(props.todo)
  }, [props])

  const handleCompleteTodoTask = useCallback(
    event => {
      const isChecked = event.target.checked
      props.completeTodoTask(props.todo, isChecked)
    },
    [props],
  )

  return (
    <li>
      <input
        className="TodoList__item-toggle"
        type="checkbox"
        checked={props.todo.isCompleted}
        onChange={handleCompleteTodoTask}
      />
      <div className="TodoList__item-title">{props.todo.title}</div>
      <button className="TodoList__item-remove" onClick={handleRemoveTodoTask} />
    </li>
  )
})
