// @flow

// $FlowFixMe
// import { nanoid } from 'nanoid'

import type { IDBObjectStoreName, IDBProviderValues } from './types'

const availableObjectStoreList = ['TodoTasks']
let db: IDBDatabase

const initIDB = (openCallback: () => void) => {
  const openRequest: IDBOpenDBRequest = window.indexedDB.open('Offline First Todo App', 1)

  openRequest.onupgradeneeded = function (event) {
    const internalDB: IDBDatabase = event.target.result

    availableObjectStoreList.forEach(availableObjectStoreName => {
      if (
        !Array.from(internalDB.objectStoreNames).includes(availableObjectStoreName) &&
        availableObjectStoreName === 'TodoTasks'
      ) {
        internalDB.createObjectStore(availableObjectStoreName, {
          keyPath: 'id',
        })
      }
    })
  }

  openRequest.onsuccess = function (event) {
    db = event.target.result

    db.onversionchange = function () {
      // db.close()
      alert(
        'Database is outdated, please, save changes, close other application tabs and reload current page.',
      )
    }

    openCallback()
  }

  openRequest.onblocked = function () {
    alert(
      'Connection to the local database is blocked. Please, close other application tabs and reload current page. ',
    )
  }
}

type IDBTransactionSuccessResponse = {| +status: 'success', data?: IDBProviderValues |}
type IDBTransactionErrorResponse = {| +status: 'error', error: Error |}
type TransactionCallback = (
  err: IDBTransactionErrorResponse | null,
  res: IDBTransactionSuccessResponse | null,
) => void

const getAll = (objectStoreName: IDBObjectStoreName, callback: TransactionCallback) => {
  const transaction = db.transaction(objectStoreName, 'readonly')
  const objectStore = transaction.objectStore(objectStoreName)

  const request = objectStore.getAll()

  transaction.oncomplete = function () {
    // $FlowFixMe
    callback(null, { status: 'success', data: { todoTasks: request.result } })
  }

  transaction.onerror = function () {
    callback({ status: 'error', error: transaction.error }, null)
  }
}

// type ChangeIDBValueFn = (
//   objectStoreName: IDBObjectStoreName,
//   value: mixed,
//   (err: IDBRequestErrorResponse | null, res: IDBRequestSuccessResponse | null) => void,
// ) => void

// const changeIDBValue: ChangeIDBValueFn = (objectStoreName, value, callback) => {
//   const transaction = db.transaction(objectStoreName, 'readwrite')
//   const objectStore = transaction.objectStore(objectStoreName)

//   const request = objectStore.put(value)

//   transaction.oncomplete = function () {
//     console.log(request)
//     console.log(transaction)
//     callback(null, { status: 'success' })
//   }

//   transaction.onerror = function () {
//     callback({ status: 'error' }, null)
//   }
// }

type PushIDBValueFn = (
  objectStoreName: IDBObjectStoreName,
  value: mixed,
  callback: TransactionCallback,
) => void

const pushIDBValue: PushIDBValueFn = (objectStoreName, value, callback) => {
  const transaction = db.transaction(objectStoreName, 'readwrite')
  const objectStore = transaction.objectStore(objectStoreName)

  objectStore.add(value)

  transaction.oncomplete = function () {
    callback(null, { status: 'success' })
  }

  transaction.onerror = function () {
    callback({ status: 'error', error: transaction.error }, null)
  }
}

export const idb = { initIDB, getAll, pushIDBValue }
