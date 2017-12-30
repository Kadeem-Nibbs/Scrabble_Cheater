import { combineReducers } from 'redux'

import board from './board'
import rack from './rack'
import tile from './tile'

const wordsAppReducers = combineReducers({
  board,
  rack,
  tile
})

export default wordsAppReducers
