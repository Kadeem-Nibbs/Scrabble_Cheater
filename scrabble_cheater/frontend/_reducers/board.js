import { 
  CHANGE_COORDINATE_VALUE
} from '../constants/actions'

import { cloneDeep } from 'lodash'
// Create an array of 15 length, with each index containing
// an array of 15 length filled with null

// TODO: could make this more performant and not have to use shouldComponentUpdate if we 
//  map between the backends format (which is the same as this array) and some sort of frontend flat object
const blankBoard = new Array(15).fill([], 0, 15).map((elem, i) => {
  return new Array(15).fill('', 0, 15)
})

const defaultState = {
  tiles: blankBoard
}

const board = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_COORDINATE_VALUE:
      const  { x, y } = action.coordinates
      const newBoard = cloneDeep(state.tiles)
    
      newBoard[y][x] = action.value

      return {
        ...state,
        tiles: newBoard
      }
    default:
      return state
  }
}

export default board
