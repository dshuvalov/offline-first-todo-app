/* eslint-disable no-param-reassign */
// @flow

import Koa from 'koa'
import { MongoClient } from 'mongodb'

const MONGO_URL = 'mongodb://localhost:27017/'

export const connect = (app: Koa) => {
  return MongoClient.connect(MONGO_URL)
    .then(client => {
      // $FlowFixMe
      app.mongo = client.db('TodoApp')
      console.log('Database connection established')
    })
    .catch(err => {
      console.log('Database connection refused')
      console.error(err)
    })
}
