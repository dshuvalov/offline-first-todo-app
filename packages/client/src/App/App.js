// @flow

import React, { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { IDBProvider } from '../controllers/IDBProvider'
import { TodoList } from '../routes/TodoList'
// import logo from './logo.svg'

const DependentProviders = () => {
  return (
    <Switch>
      <Route exact path="/" component={TodoList} />
      {/* <Route
            path="/todo/:todoId"
            render={({ history, location: { pathname }, match }) => (
              <TodoCard params={getParams(pathname, paths)} match={match} history={history} />
            )}
          /> */}
    </Switch>
  )
}

const App = () => {
  return (
    <Fragment>
      <h1>todos</h1>
      <Router>
        <IDBProvider>
          <DependentProviders />
        </IDBProvider>
      </Router>
    </Fragment>
  )
}

export { App }
