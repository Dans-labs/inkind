import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { reducer as form } from 'redux-form'

import settings from 'settings'
import win from 'win'
import server from 'server'
import notes from 'notes'
import docs from 'docs'
import tables from 'tables'
import me from 'me'
import filters from 'filters'
import alter from 'alter'
import select from 'select'
import grid from 'grid'
import workflow from 'workflow'

/* ACTIONS */

/* global process */
/* global require */

/* actions to ignore in logging and in the redux dev tool
 * Mainly used for actions generated by third party libraries, such as redux-form
 */

const predicate = (state, action) => !action.type.startsWith('@@redux-form')

//const predicate = () => true // if you want to see all actions

const configureStore = reducer => {
  let store
  if (process.env.NODE_ENV === `development`) {
    const { createLogger } = require(`redux-logger`)
    const { composeWithDevTools } = require('redux-devtools-extension')
    const composeEnhancers = composeWithDevTools({ predicate })
    store = createStore(
      reducer,
      composeEnhancers(
        applyMiddleware(thunkMiddleware, createLogger({ predicate })),
      ),
    )
  } else {
    store = createStore(reducer, applyMiddleware(thunkMiddleware))
  }
  return store
}

/* REDUCER */

export default configureStore(
  combineReducers({
    settings,
    win,
    server,
    notes,
    docs,
    tables,
    me,
    filters,
    alter,
    form,
    select,
    grid,
    workflow,
  }),
)

/* SELECTORS */

/* HELPERS */
