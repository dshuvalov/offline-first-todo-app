// @flow

import React from 'react'

import type { IDBProviderValues, PathToValueOrArray, IDBObjectStoreName } from './types'

const logWarning = () => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      '[UserStateProvider] UserStateProvider is rendered lower in the tree than his context was used',
    )
  }
}

export type IDBProviderContextType = {|
  store: IDBProviderValues,
  // changeValue: (pathToValue: PathToValueOrArray, value: mixed) => void,
  pushValue: (
    idbObjectStoreName: IDBObjectStoreName,
    pathToArray: PathToValueOrArray,
    value: mixed,
  ) => void,
|}

const defaultContext: IDBProviderContextType = {
  store: {
    todoTasks: [],
  },
  pushValue: logWarning,
}

export const IDBProviderContext = React.createContext<IDBProviderContextType>(defaultContext)
