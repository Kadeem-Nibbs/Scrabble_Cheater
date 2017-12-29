import { TOGGLE_GAME_TYPE } from '../constants/actions'

import { 
  WORDS_WITH_FRIENDS, 
  SCRABBLE
} from '../constants/board'

// Create an array of 15 length, with each index containing
// an array of 15 length filled with null
const blankBoard = new Array(15).fill([], 0, 15).map((elem, i) => {
  return new Array(15).fill('', 0, 15)
})

// TODO: move to its own state
const suggestedWords = null
const wordHoveredKey = null

const defaultState = {
  gameType: WORDS_WITH_FRIENDS,
  boardData: blankBoard,
  suggestedWords,
  wordHoveredKey
}

const board = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_GAME_TYPE:
      const gameType = state.gameType === WORDS_WITH_FRIENDS ? SCRABBLE : WORDS_WITH_FRIENDS

      return {
        ...state,
        gameType
      }

    default:
      return state
  }
}

export default board
