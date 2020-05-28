// @flow

import Koa from 'koa'
import type { Context } from 'koa'
import type { Db } from 'mongodb'

type App = {
  ...Koa,
  mongo: Db,
}

type AppContext = {
  ...Context,
  app: App,
}

export type { AppContext }
