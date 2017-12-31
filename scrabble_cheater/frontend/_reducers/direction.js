import { 
  SET_MOVE_DIRECTION
} from '../constants/actions'


const defaultState = {
  direction: null
}

const direction = (state = defaultState, action) => {
  switch (action.type) {
    case SET_MOVE_DIRECTION:
      return {
        ...state,
        direction: action.direction
      }
    default:
      return state
  }
}

export default direction