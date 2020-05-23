// @flow

import type {
  InitIDBFn,
  GetAllIDBFn,
  PushIDBValueFn,
  ChangeIDBValueFn,
  DeleteIDBValueFn,
} from './types'

const availableObjectStoreList = ['TodoTasks']
let db: IDBDatabase

const initIDB: InitIDBFn = () =>
  new Promise((resolve, reject) => {
    const openRequest: IDBOpenDBRequest = window.indexedDB.open('Offline First Todo App', 1)

    openRequest.onupgradeneeded = function onupgradeneeded(event) {
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

    openRequest.onsuccess = function onsuccess() {
      db = openRequest.result

      db.onversionchange = function onversionchange() {
        // db.close()
        alert(
          'Database is outdated, please, save changes, close other application tabs and reload current page.',
        )
      }

      resolve({ status: 'success', data: null })
    }

    openRequest.onblocked = function onblocked() {
      alert(
        'Connection to the local database is blocked. Please, close other application tabs and reload current page. ',
      )
    }

    openRequest.onerror = function onerror() {
      const { error } = openRequest
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(error)
    }
  })

const getAll: GetAllIDBFn = objectStoreName =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readonly')
    const objectStore = transaction.objectStore(objectStoreName)

    const request = objectStore.getAll()

    transaction.oncomplete = function oncomplete() {
      resolve({ status: 'success', data: request.result })
    }

    transaction.onerror = function onerror() {
      const { error } = transaction

      reject(error)
    }
  })

const pushIDBValue: PushIDBValueFn = (objectStoreName, value) =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readwrite')
    const objectStore = transaction.objectStore(objectStoreName)

    objectStore.add(value)

    transaction.oncomplete = function oncomplete() {
      resolve({ status: 'success', data: null })
    }

    transaction.onerror = function onerror() {
      const { error } = transaction

      reject(error)
    }
  })

const changeIDBValue: ChangeIDBValueFn = (objectStoreName, value) =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readwrite')
    const objectStore = transaction.objectStore(objectStoreName)

    objectStore.put(value)

    transaction.oncomplete = function oncomplete() {
      resolve({ status: 'success', data: null })
    }

    transaction.onerror = function onerror() {
      const { error } = transaction

      reject(error)
    }
  })

const deleteIDBValue: DeleteIDBValueFn = (objectStoreName, id) =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readwrite')
    const objectStore = transaction.objectStore(objectStoreName)

    objectStore.delete(id)

    transaction.oncomplete = function oncomplete() {
      resolve({ status: 'success', data: null })
    }

    transaction.onerror = function onerror() {
      const { error } = transaction

      reject(error)
    }
  })

export const idb = { initIDB, getAll, pushIDBValue, changeIDBValue, deleteIDBValue }
