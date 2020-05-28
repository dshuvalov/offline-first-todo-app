// @flow

import React from 'react'

type Props = {|
  value: string,
  className?: string,
  placeholder?: string,
  onChange?: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  onKeyDown?: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
|}

export const Input = (props: Props) => {
  return <input autoFocus type="text" {...props} />
}
