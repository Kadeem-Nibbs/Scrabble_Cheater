import { UPDATE_RACK, RECEIVED_SUGGESTED_WORDS, SENT_TABLE_DATA } from '../constants/actions'

const defaultState = {
  rack: '',
  suggestedWords: [],
  loading: false
}

const getWords = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_RACK:      
      return {
        ...state,
        rack: action.rack
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
