import './global-styles/index'

import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import reducers from './_reducers'


import App from './components/App.js'

const store = createStore(reducers, applyMiddleware(thunk))

const Root = () => {
  return (
    <Provider store={ store }>
      <App />
    </Provider>
  )
}

ReactDOM.render(<Root />, document.querySelector('#root'))