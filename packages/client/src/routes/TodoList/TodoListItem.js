// @flow

import React from 'react'

type Props = {|
  id: string,
  todoTitle: string,
  index: number,
  isTodoCompleted: boolean,
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

  return (
    <li>
      <input
        className="TodoList__item-toggle"
        type="checkbox"
        checked={props.isTodoCompleted}
        // onChange={this.handleCompleteTodo.bind(this, todo)}
      />
      <div className="TodoList__item-title">{props.todoTitle}</div>
      <button
        className="TodoList__item-remove"
        // onClick={() => props.removeTodo({ todoId: props.id, todoIndex: props.index })}
      />
    </li>
  )
})
