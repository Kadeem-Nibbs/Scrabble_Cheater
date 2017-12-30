import { 
  MAKE_TILE_EDITABLE, 
  TOGGLE_GAME_TYPE,
  UPDATE_RACK,
  SET_MOVE_DIRECTION,
  CHANGE_COORDINATE_VALUE
} from '../constants/actions'

// Board
export const toggleGameType = () => {
  return { type: TOGGLE_GAME_TYPE }
}

export const updateRack = (value) => ({
  type: UPDATE_RACK,
  value
})

export const setMoveDirection = (direction) => ({
  type: SET_MOVE_DIRECTION,
  direction
})

// Tile
const makeTileEditable = (coordinates) => ({
  type: MAKE_TILE_EDITABLE,
  coordinates
})

// Thunks
//// Edit tile and move onto next tile
const changeCoordinateValue = (coordinates, value) => ({
  type: CHANGE_COORDINATE_VALUE,
  value,
  coordinates
})

export const changeValueMoveToNextTile = (coordinates, value) => {
  return (dispatch, getState) => {
    dispatch(changeCoordinateValue(coordinates, value))

    let newEditCoordinates
    if(getState().board.direction === 'right') {
      newEditCoordinates = { ...coordinates, x: coordinates.x + 1 }
    } else { // must be down
      newEditCoordinates = { ...coordinates, y: coordinates.y + 1 }
    }

    dispatch(makeTileEditable(newEditCoordinates))
  }
}

export const changeValueMoveToNextTileWithArrowKeys = (direction, coordinates, value) => {
  return (dispatch, getState) => {
    // setMoveDirection
  }
}

export const resetDirectionAndMakeTileEditable = (coordinates) => {
  return (dispatch, getState) => {
    // Is this right ?
    Promise.resolve(dispatch(setMoveDirection(null)))
              .then(dispatch(makeTileEditable(coordinates)))
  }
}


