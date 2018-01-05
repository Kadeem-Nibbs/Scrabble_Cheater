import { 
  MAKE_TILE_EDITABLE,
  SET_MOVE_DIRECTION
} from '../constants/actions'

const defaultState = {
  editableX: null,
  editableY: null
}

const tile = (state = defaultState, action) => {
  switch (action.type) {
    case MAKE_TILE_EDITABLE:
      return {
        ...state,
        editableX: action.coordinates.x,
        editableY: action.coordinates.y
      }
    case SET_MOVE_DIRECTION:
      return {
        ...state,
        direction: action.direction
      }
    default:
      return state
  }
}

export default tile
