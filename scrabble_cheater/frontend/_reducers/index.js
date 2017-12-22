import { combineReducers } from 'redux'

import board from './board'
// import tiles from './tiles'

const wordsAppReducers = combineReducers({
  board,
  // tiles
})

export default wordsAppReducers
