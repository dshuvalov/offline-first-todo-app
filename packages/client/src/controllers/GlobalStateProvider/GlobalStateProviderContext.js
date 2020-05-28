// @flow

import React from 'react'
import type { GlobalStateProviderContextType } from './types/GlobalStateProviderContext'

const logWarning = () => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      '[GlobalStateProviderContext] GlobalStateProviderContext is rendered lower in the tree than his context was used',
    )
  }
}

const defaultContext = {
  state: {
    todoTasks: [],
  },
  dispatch: logWarning,
}

export const GlobalStateProviderContext = React.createContext<GlobalStateProviderContextType>(
  defaultContext,
)
