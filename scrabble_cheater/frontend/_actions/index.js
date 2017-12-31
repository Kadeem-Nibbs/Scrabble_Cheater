import { 
  MAKE_TILE_EDITABLE, 
  TOGGLE_GAME_TYPE,
  UPDATE_RACK,
  SET_MOVE_DIRECTION,
  CHANGE_COORDINATE_VALUE,
  RECEIVED_SUGGESTED_WORDS,
  SENT_TABLE_DATA
} from '../constants/actions'

// Board
export const toggleGameType = () => {
  return { type: TOGGLE_GAME_TYPE }
}

export const updateRack = (value) => ({
  type: UPDATE_RACK,
  rack: value
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

const changeCoordinateValue = (coordinates, value) => {
  return {
    type: CHANGE_COORDINATE_VALUE,
    value,
    coordinates
  }
}

// Thunks
export const changeValueMoveToNextTile = (coordinates, value) => {
  return (dispatch, getState) => {
    const direction = getState().direction.direction

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

    dispatch(changeCoordinateValue(coordinates, value))
    dispatch(makeTileEditable(newEditCoordinates))
  }
}

// For new clicks on tiles, set direction
export const resetDirectionAndMakeTileEditable = (coordinates) => {
  return (dispatch, getState) => {
    let { x, y } = coordinates
    let direction = null
    const currentBoard = getState().board.present.boardData


    // Keep the same direction if the tile is already populated
    // as this is probably the user going back and correctly a typo
    if(currentBoard && currentBoard[y]) {
      const currentTile = currentBoard[y][x]
      direction = currentTile.length ? getState().direction.direction : null
    }

    dispatch(setMoveDirection(direction))
    dispatch(makeTileEditable(coordinates))
  }
}

// Rack / table data emit stuff
const sentTableData = () => ({
  type: SENT_TABLE_DATA
})

export const submitTableData = (socket) => {
  return (dispatch, getState) => {

    dispatch(sentTableData({ loading: true }))

    const tableData = {
      gameType: getState().gameType.gameType,
      board: getState().board.present.boardData,
      rack: getState().getWords.rack
    }

    // Note: component socketIoHOC will receive the data and trigger receiveTableData
    socket.emit('analyze_board', JSON.stringify(tableData))
  }
}

export const receivedTableData = (suggestedWords) => ({
  type: RECEIVED_SUGGESTED_WORDS,
  suggestedWords
})
