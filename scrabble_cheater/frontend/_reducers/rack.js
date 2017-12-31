import { UPDATE_RACK, RECEIVED_SUGGESTED_WORDS, SENT_TABLE_DATA } from '../constants/actions'

const defaultState = {
  value: '',
  suggestedWords: [],
  loading: false
}

const rack = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_RACK:      
      return {
        ...state,
        value: action.value
      }
    case SENT_TABLE_DATA: 
      return {
        ...state,
        loading: true
      }
    case RECEIVED_SUGGESTED_WORDS:
    console.log('suggestedWords', action.suggestedWords);
      return {
        ...state,
        suggestedWords: action.suggestedWords,
        loading: false
      }

    default:
      return state
  }
}

export default rack
