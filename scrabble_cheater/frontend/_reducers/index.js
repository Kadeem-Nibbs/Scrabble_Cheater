import { combineReducers } from 'redux'
import undoable from 'redux-undo'

console.log('undoable', undoable);
import board from './board'
import rack from './rack'
import tile from './tile'

const wordsAppReducers = combineReducers({
  board,
  rack,
  tile
})

export default wordsAppReducers
