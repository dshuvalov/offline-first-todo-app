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
    const result = await ctx.app.mongo.collection('Tasks').find().toArray()
    ctx.body = result
    ctx.status = 200
  } catch (error) {
    console.log('GET:/tasks', error)
    ctx.body = error
    ctx.status = 500
  }
})

router.post('/task', async function (ctx: AppContext) {
  try {
    const { request } = ctx
    await ctx.app.mongo.collection('Tasks').insertOne(request.body)
    ctx.status = 200
  } catch (error) {
    console.log('POST:/task', error)
    ctx.body = error
    ctx.status = 500
  }
})

connect(app).then(() => app.listen(8080))
