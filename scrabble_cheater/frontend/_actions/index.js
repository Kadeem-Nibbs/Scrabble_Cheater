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

const changeCoordinateValue = (coordinates, value) => ({
  type: CHANGE_COORDINATE_VALUE,
  value,
  coordinates
})

// Thunks
export const changeValueMoveToNextTile = (coordinates, value) => {
  return (dispatch, getState) => {
    const direction = getState().board.direction
    
    let newEditCoordinates
    if(direction === 'right') {
      newEditCoordinates = { ...coordinates, x: coordinates.x + 1 }
    } else if (direction === 'left') {
      newEditCoordinates = { ...coordinates, x: coordinates.x - 1 }
    } else if (direction === 'down') {
      newEditCoordinates = { ...coordinates, y: coordinates.y + 1 }
    } else if (direction === 'up') {
      newEditCoordinates = { ...coordinates, y: coordinates.y - 1 }
    }

    Promise.resolve(dispatch(changeCoordinateValue(coordinates, value)))
              .then(dispatch(makeTileEditable(newEditCoordinates)))
  }
}

// For new clicks on tiles, set direction
export const resetDirectionAndMakeTileEditable = (coordinates) => {
  return (dispatch, getState) => {
    // Is this right ?
    Promise.resolve(dispatch(setMoveDirection(null)))
              .then(dispatch(makeTileEditable(coordinates)))
  }
}

// For using arrow keys to set direction
export const changeValueMoveToNextTileWithArrowKeys = (coordinates, direction, value) => {
  return (dispatch, getState) => {
    Promise.resolve(dispatch(setMoveDirection(direction)))
              .then(dispatch(changeValueMoveToNextTile(coordinates, value)))
    
  }
}



