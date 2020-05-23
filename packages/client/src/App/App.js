// @flow

import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { idb } from '../controllers/idb'
import {
  GlobalStateProvider,
  useGlobalStateProvider,
  fetchTodoTasks,
} from '../controllers/GlobalStateProvider'

import { TodoList } from '../routes/TodoList'
// import logo from './logo.svg'

const DependentProviders = () => {
  const { dispatch } = useGlobalStateProvider()
  useEffect(() => {
    const populateDataToGlobalStateProvider = async () => {
      const { initIDB } = idb
      await initIDB()
      fetchTodoTasks(dispatch)
    }
    populateDataToGlobalStateProvider()
  }, [dispatch])
  return (
    <Switch>
      <Route exact path="/" component={TodoList} />
    </Switch>
  )
}

const App = () => {
  return (
    <Fragment>
      <h1>todos</h1>
      <Router>
        <GlobalStateProvider>
          <DependentProviders />
        </GlobalStateProvider>
      </Router>
    </Fragment>
  )
}

export { App }
