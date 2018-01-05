import { 
  CHANGE_COORDINATE_VALUE,
  PLAY_WORD,
  SET_MOVE_DIRECTION,
  MAKE_TILE_EDITABLE
} from '../constants/actions'

import { combineReducers } from 'redux'
import undoable, { includeAction } from 'redux-undo'

import board from './board'
import websockets from './websockets'
import tile from './tile'
import gameType from './gameType'
import rack from './rack'
import wordList from './wordList'

const wordsAppReducers = combineReducers({
  board: undoable(board, { filter: includeAction([CHANGE_COORDINATE_VALUE, PLAY_WORD]) }),
  tile: undoable(tile, { filter: includeAction([CHANGE_COORDINATE_VALUE, PLAY_WORD]) }),
  rack: undoable(rack, { filter: includeAction([CHANGE_COORDINATE_VALUE, PLAY_WORD]) }),
  wordList: undoable(wordList, { filter: includeAction([CHANGE_COORDINATE_VALUE, PLAY_WORD]) }),
  websockets,
  gameType
})

export default wordsAppReducers
