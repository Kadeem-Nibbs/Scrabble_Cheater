import { 
  RECEIVED_SUGGESTED_WORDS, 
  SENT_TABLE_DATA,
  RESET_SUGGESTED_WORDS
} from '../constants/actions'

const defaultState = {
  suggestedWords: null,
  loading: false
}

const getWords = (state = defaultState, action) => {
  switch (action.type) {
    case RESET_SUGGESTED_WORDS: 
      return {
        ...state,
        suggestedWords: null
      }
    case SENT_TABLE_DATA: 
      return {
        ...state,
        loading: true
      }
    case RECEIVED_SUGGESTED_WORDS:
      return {
        ...state,
        suggestedWords: action.suggestedWords,
        loading: false
      }
    default:
      return state
  }
}

export default getWords
