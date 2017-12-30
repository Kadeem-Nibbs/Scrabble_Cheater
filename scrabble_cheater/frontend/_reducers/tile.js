import { 
  MAKE_TILE_EDITABLE
} from '../constants/actions'

const defaultState = {
  editableTilecoordinates: {
    editableX: null,
    editableY: null
  }
}

// Note: when updating a tile value, we edit the coordinate on the board directly, 
// so see the 'board' action CHANGE_COORDINATE_VALUE

const tile = (state = defaultState, action) => {
  switch (action.type) {
    case MAKE_TILE_EDITABLE:
      return {
        ...state,
        editableTilecoordinates: {
          editableX: action.coordinates.x,
          editableY: action.coordinates.y
        }
      }
    default:
      return state
  }
}

export default tile
