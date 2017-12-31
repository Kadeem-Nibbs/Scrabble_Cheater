import { UPDATE_RACK } from '../constants/actions'

const defaultState = { letters: '' }

const rack = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_RACK:      
      return {
        ...state,
        letters: action.letters
      }
    default:
      return state
  }
}

export default rack
