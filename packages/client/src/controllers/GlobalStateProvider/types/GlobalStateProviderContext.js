// @flow

import type { GlobalStateProviderActions, GlobalStateProviderState } from './GlobalStateProvider'

type GlobalStateProviderContextType = {|
  state: GlobalStateProviderState,
  dispatch: GlobalStateProviderActions => void,
|}

export type { GlobalStateProviderContextType }
