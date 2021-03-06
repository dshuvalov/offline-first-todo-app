// @flow

import * as R from 'ramda'

import type { GlobalStateProviderState } from '../types/GlobalStateProvider'

type PathToValueOrArray = $ReadOnlyArray<string | number>

const hasOwnProperty = (obj: $AnyObject, key: string | number): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key)

const actionWithPath = (
  obj: GlobalStateProviderState,
  pathToArray: PathToValueOrArray,
  fn: (o: any, key: string | number) => void,
) => {
  if (!obj || !Array.isArray(pathToArray) || !pathToArray.length) {
    console.error('Your path to value is not an array')
    return obj
  }

  if (pathToArray.length < 2 && hasOwnProperty(obj, pathToArray[0])) {
    fn(obj, pathToArray[0])
    return obj
  }

  const clonePathToArray = [...pathToArray]
  const nestedKey = clonePathToArray.pop()

  const nestedObj = R.pathOr(null, clonePathToArray, obj)

  if (nestedObj && hasOwnProperty(nestedObj, nestedKey)) fn(nestedObj, nestedKey)
  return obj
}

export const changeValueByPath = (
  obj: GlobalStateProviderState,
  pathToValue: PathToValueOrArray,
  value: mixed,
) =>
  actionWithPath(obj, pathToValue, (o, key) => {
    const copyO = o
    copyO[key] = value
  })

export const pushValueByPath = (
  obj: GlobalStateProviderState,
  pathToArray: PathToValueOrArray,
  value: mixed,
) => actionWithPath(obj, pathToArray, (o, key) => o[key].push(value))

export const removeValueByPath = (
  obj: GlobalStateProviderState,
  pathToArray: PathToValueOrArray,
  index: number,
) => actionWithPath(obj, pathToArray, (o, key) => o[key].splice(index, 1))
