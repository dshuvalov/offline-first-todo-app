/* eslint-disable require-atomic-updates */
// @flow

import Koa from 'koa'
import Router from '@koa/router'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import { connect } from './db'

import type { AppContext } from './types'

const app = new Koa()
const router = new Router({ prefix: '/api' })

app.use(logger())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

router.get('/tasks', async function (ctx: AppContext) {
  try {
    const result = await ctx.app.mongo
      .collection('Tasks')
      .find()
      .map(document => {
        const { _id, ...data } = document
        return data
      })
      .toArray()
    ctx.body = result
    ctx.type = 'json'
    ctx.status = 200
  } catch (error) {
    console.log('GET:/tasks', error)
    ctx.type = 'json'
    ctx.status = error.status || 500
    ctx.body = { message: 'Internal Server Error' }
  }
})

router.post('/task', async function (ctx: AppContext) {
  try {
    const { request } = ctx

    await ctx.app.mongo.collection('Tasks').insertOne(request.body)

    ctx.type = 'json'
    ctx.status = 201
    ctx.body = { message: 'Task was successfully created' }
  } catch (error) {
    console.log('POST:/task', error)
    ctx.type = 'json'
    ctx.status = error.status || 500
    ctx.body = { message: 'Internal Server Error' }
  }
})

router.delete('/task', async function (ctx: AppContext) {
  try {
    const { request } = ctx
    // $FlowFixMe
    await ctx.app.mongo.collection('Tasks').deleteOne({ id: request.body.todoTaskId })

    ctx.type = 'json'
    ctx.status = 200
    ctx.body = { message: 'Task was successfully deleted' }
  } catch (error) {
    console.log('POST:/task', error)
    ctx.type = 'json'
    ctx.status = error.status || 500
    ctx.body = { message: 'Internal Server Error' }
  }
})

connect(app).then(() => app.listen(8080))
