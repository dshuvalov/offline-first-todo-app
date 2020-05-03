// @flow

import React from 'react'
// import classnames from 'classnames'

type Props = {|
  value: string,
  className?: string,
  placeholder?: string,
  onChange?: (value: string, event: SyntheticEvent<HTMLInputElement>) => void,
  onKeyDown?: (event: SyntheticKeyboardEvent<>) => void,
|}

export const Input = (props: Props) => {
  return <input autoFocus type="text" {...props} />
}
