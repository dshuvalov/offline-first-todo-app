// @flow

import React, { useCallback, useState, useEffect } from 'react'
import { IDBProviderContext } from './context'
import { idb } from './idb'
import { pushValueByPath } from './utils'
import type { IDBProviderValues } from './types'

type Props = {|
  children: React$Node,
|}

export const IDBProvider = (props: Props) => {
  const [store, setStoreValues] = useState<IDBProviderValues>({
    todoTasks: [],
  })

  useEffect(() => {
    const populateDataToState = () =>
      idb.getAll('TodoTasks', (err, res) => {
        if (err) {
          return
        }

        if (res && res.data) {
          const { data } = res
          setStoreValues(() => ({ ...data }))
        }
      })
    idb.initIDB(populateDataToState)
  }, [])

  const pushValue = useCallback(
    (idbObjectStoreName, pathToValue, value) => {
      idb.pushIDBValue(idbObjectStoreName, value, err => {
        if (err) {
          return
        }
        const newStoreValues = pushValueByPath(store, pathToValue, value)
        setStoreValues(() => ({ ...newStoreValues }))
      })
    },
    [store],
  )

  return (
    <IDBProviderContext.Provider value={{ store, pushValue }}>
      {props.children}
    </IDBProviderContext.Provider>
  )
}
