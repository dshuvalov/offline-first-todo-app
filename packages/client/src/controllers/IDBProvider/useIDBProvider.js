// @flow

import { useContext } from 'react'
import { IDBProviderContext, type IDBProviderContextType } from './context'

export const useIDBProvider = (): IDBProviderContextType => useContext(IDBProviderContext)
