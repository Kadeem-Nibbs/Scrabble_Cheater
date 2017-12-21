import React from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

import Board from './components/Board/BoardContainer'

const Root = () => {
  return (
    <Board />
  )
}

ReactDOM.render(<Root />, document.querySelector('#root'))