import { 
  TOGGLE_GAME_TYPE,
  CHANGE_COORDINATE_VALUE,
  SET_MOVE_DIRECTION
} from '../constants/actions'

import { 
  WORDS_WITH_FRIENDS, 
  SCRABBLE
} from '../constants/board'

// Create an array of 15 length, with each index containing
// an array of 15 length filled with null

// TODO: could make this more performant and not have to use shouldComponentUpdate if we 
//  map between the backends format (which is the same as this array) and some sort of frontend flat object
const blankBoard = new Array(15).fill([], 0, 15).map((elem, i) => {
  return new Array(15).fill('', 0, 15)
})

const defaultState = {
  gameType: WORDS_WITH_FRIENDS,
  boardData: blankBoard,
  direction: null
}

const board = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_GAME_TYPE:
      const gameType = state.gameType === WORDS_WITH_FRIENDS ? SCRABBLE : WORDS_WITH_FRIENDS

      return {
        ...state,
        gameType
      }
    case SET_MOVE_DIRECTION:
      return {
        ...state,
        direction: action.direction
      }
    case CHANGE_COORDINATE_VALUE:
      const  { x, y } = action.coordinates
      const newBoardData = state.boardData.slice()
      newBoardData[y][x] = action.value

      return {
        ...state,
        boardData: newBoardData
      }

    default:
      return state
  }
}

export default board
