// @flow

import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { idb } from '../controllers/idb'
import { GlobalStateProvider, useGlobalStateProvider } from '../controllers/GlobalStateProvider'
import { fetchTodoTasks } from '../actions'
import { TodoList } from '../routes/TodoList'

import './App.css'
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
          <ToastContainer
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            rtl={false}
          />
        </GlobalStateProvider>
      </Router>
    </Fragment>
  )
}

export { App }
