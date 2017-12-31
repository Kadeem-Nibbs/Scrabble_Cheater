import { 
  HIGHLIGHT_SUGGESTED_WORD
} from '../constants/actions'

const defaultState = {
  wordCoordinates: []
}

const wordList = (state = defaultState, action) => {
  switch (action.type) {
    case HIGHLIGHT_SUGGESTED_WORD:
      return {
        ...state,
        wordCoordinates: action.wordCoordinates
      }
    default:
      return state
  }
}

export default wordList
