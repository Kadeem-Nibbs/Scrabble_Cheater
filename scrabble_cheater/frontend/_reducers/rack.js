import { UPDATE_RACK } from '../constants/actions'

const defaultState = {
  value: ''
}

const rack = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_RACK:


      
      return {
        ...state,
        value: action.value
      }

    default:
      return state
  }
}

export default rack
