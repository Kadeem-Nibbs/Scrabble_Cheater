import { 
  CHANGE_COORDINATE_VALUE,
  PLAY_WORD
} from '../constants/actions'

import { cloneDeep } from 'lodash'
// Create an array of 15 length, with each index containing
// an array of 15 length filled with null

// TODO: could make this more performant and not have to use shouldComponentUpdate if we 
//  map between the backends format (which is the same as this array) and some sort of frontend flat object
const blankBoard = new Array(15).fill([], 0, 15).map((elem, i) => {
  return new Array(15).fill(null, 0, 15)
})

const defaultState = {
  tiles: blankBoard
}

const board = (state = defaultState, action) => {
  const newTiles = cloneDeep(state.tiles)

  switch (action.type) {
    case CHANGE_COORDINATE_VALUE:
      const  { x, y } = action.coordinates
    
      // If the user has set the input to blank (which react likes to use '' for)
      // set it to null in the `state` as the backend expects a null value
      newTiles[y][x] = action.value === "" ? null : action.value

      return {
        ...state,
        tiles: newTiles
      }
    case PLAY_WORD:
      const { wordInfo } = action
      const firstY = wordInfo[1][0][0]
      const secondY = wordInfo[1][1][0]

      const firstX = wordInfo[1][0][1]
      const secondX = wordInfo[1][1][1]
      
      const yDistance = secondY - firstY
      const xDistance = secondX - firstX

      if(firstY === secondY)  {
        for(let i = 0; i <= xDistance; i++) {
          newTiles[firstY][firstX + i] = wordInfo[2][i]
        }

      } else if (firstX === secondX) {
        for(let i = 0; i <= yDistance; i++) {
          newTiles[firstY + i][firstX] = wordInfo[2][i]
        }
      }

      return {
        ...state,
        tiles: newTiles
      }
    default:
      return state
  }
}

export default board
