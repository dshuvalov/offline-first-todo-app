// @flow

import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import { connect } from './db'
import api from './api'

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(api.routes())
app.use(api.allowedMethods())

connect(app).then(() => app.listen(8080))
