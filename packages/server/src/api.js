/* eslint-disable require-atomic-updates */
// @flow

import Router from '@koa/router'
import type { AppContext } from './types'

const router = new Router({ prefix: '/api' })

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
    await ctx.app.mongo.collection('Tasks').deleteOne({ id: request.body.id })

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

router.put('/task', async function (ctx: AppContext) {
  try {
    const { request } = ctx
    // $FlowFixMe
    await ctx.app.mongo.collection('Tasks').replaceOne({ id: request.body.id }, request.body)

    ctx.type = 'json'
    ctx.status = 200
    ctx.body = { message: 'Task was successfully updated' }
  } catch (error) {
    console.log('POST:/task', error)
    ctx.type = 'json'
    ctx.status = error.status || 500
    ctx.body = { message: 'Internal Server Error' }
  }
})

// eslint-disable-next-line import/no-default-export
export default router
