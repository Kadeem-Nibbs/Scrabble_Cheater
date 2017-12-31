import { 
  CHANGE_COORDINATE_VALUE
} from '../constants/actions'

import { combineReducers } from 'redux'
import undoable, { includeAction } from 'redux-undo'

import board from './board'
import rack from './rack'
import tile from './tile'
import gameType from './gameType'
import direction from './direction'

const wordsAppReducers = combineReducers({
  board: undoable(board, { filter: includeAction(CHANGE_COORDINATE_VALUE) }),
  rack,
  tile,
  gameType,
  direction
})

export default wordsAppReducers
