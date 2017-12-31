import { 
  CHANGE_COORDINATE_VALUE,
  SET_MOVE_DIRECTION,
  MAKE_TILE_EDITABLE
} from '../constants/actions'

import { combineReducers } from 'redux'
import undoable, { includeAction } from 'redux-undo'

import board from './board'
import getWords from './getWords'
import tile from './tile'
import gameType from './gameType'
import rack from './rack'
import direction from './direction'

const wordsAppReducers = combineReducers({
  board: undoable(board, { filter: includeAction(CHANGE_COORDINATE_VALUE) }),
  tile: undoable(tile, { filter: includeAction(CHANGE_COORDINATE_VALUE) }),
  getWords,
  rack,
  gameType,
  direction,
})

export default wordsAppReducers
