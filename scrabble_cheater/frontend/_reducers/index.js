import { combineReducers } from 'redux'

import board from './board'
import rack from './rack'

const wordsAppReducers = combineReducers({
  board,
  rack
})

export default wordsAppReducers
