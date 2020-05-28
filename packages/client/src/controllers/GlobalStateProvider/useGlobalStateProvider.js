// @flow

import { useContext } from 'react'
import { GlobalStateProviderContext } from './GlobalStateProviderContext'
import type { GlobalStateProviderContextType } from './types/GlobalStateProviderContext'

export const useGlobalStateProvider = (): GlobalStateProviderContextType =>
  useContext(GlobalStateProviderContext)
