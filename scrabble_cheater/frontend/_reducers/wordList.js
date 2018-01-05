import { 
  HIGHLIGHT_SUGGESTED_WORD,
  HIDE_SUGGESTED_WORDS,
  SHOW_SUGGESTED_WORDS
} from '../constants/actions'

const defaultState = {
  wordCoordinates: [],
  wordAdded: false
}

const wordList = (state = defaultState, action) => {
  switch (action.type) {
    case HIGHLIGHT_SUGGESTED_WORD:
      return {
        ...state,
        wordCoordinates: action.wordCoordinates
      }
    case HIDE_SUGGESTED_WORDS: 
      return {
        ...state,
        wordAdded: true
      }
    case SHOW_SUGGESTED_WORDS: 
      return {
        ...state,
        wordAdded: false
      }
    default:
      return state
  }
}

export default wordList
