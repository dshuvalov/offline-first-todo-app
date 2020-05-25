// @flow

import React, { useCallback } from 'react'
import { type TodoTask } from '../../controllers/GlobalStateProvider'

type Props = {|
  todo: TodoTask,
  removeTodoTask: (todoTask: TodoTask) => void,
|}

export const TodoListItem = React.memo<Props>(function TodoListItem(props) {
  //   const handleDoubleClick = () => {
  //     let {
  //       history,
  //       todo: { todoId },
  //     } = this.props
  //     history.push(`/todo/${todoId}`)
  //   }

  //   const handleCompleteTodo = todo => {
  //     let { dispatch } = this.props
  //     let { todoId, completed: prevCompletedValue } = todo
  //     dispatch.sync(completeTodo({ todoId, completed: !prevCompletedValue }), {
  //       reasons: ['completeTodo'],
  //     })
  //   }
  const handleRemoveTodoTask = useCallback(() => {
    props.removeTodoTask(props.todo)
  }, [props])

  return (
    <li>
      <input
        className="TodoList__item-toggle"
        type="checkbox"
        checked={props.todo.isCompleted}
        onChange={() => {}}
      />
      <div className="TodoList__item-title">{props.todo.title}</div>
      <button className="TodoList__item-remove" onClick={handleRemoveTodoTask} />
    </li>
  )
})
