import { 
  CHANGE_COORDINATE_VALUE,
  PLAY_WORD,
  SET_MOVE_DIRECTION,
  MAKE_TILE_EDITABLE,
  CLEAR_BOARD
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
  websockets: undoable(websockets, { filter: includeAction([CHANGE_COORDINATE_VALUE, PLAY_WORD]) }),
  gameType
})

// Have to do this because of flaw in redux-undo, fixed it beta
// https://github.com/omnidan/redux-undo/issues/163
const defaultRootState = {
  board: { past: [], future: [] },
  tile: { past: [], future: [] },
  rack: { past: [], future: [] },
  wordList: { past: [], future: [] },
  websockets: { past: [], future: [] }
}
// Clear action - overviewed here:
// https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
const rootReducer = (state, action) => {
  if(action.type === CLEAR_BOARD) {
    state = defaultRootState
  }
  return wordsAppReducers(state, action)
}

export default rootReducer
