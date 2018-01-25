import { 
  TOGGLE_GAME_TYPE
} from '../constants/actions'

import { 
  WORDS_WITH_FRIENDS, 
  SCRABBLE
} from '../constants/board'

const defaultState =  {
  gameType: WORDS_WITH_FRIENDS
}

const gameType = (state = defaultState, action) => {
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

export default gameType