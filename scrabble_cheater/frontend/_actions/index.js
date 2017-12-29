import { 
  MAKE_TILE_EDITABLE, 
  TOGGLE_GAME_TYPE 
} from '../constants/actions'

export const makeTileEditable = (coordinates) => ({
  type: MAKE_TILE_EDITABLE,
  coordinates
})

export const toggleGameType = () => {
  console.log('??? toggleGameType');
  return { type: TOGGLE_GAME_TYPE }
}


export const updateRack = (newRack) => ({
  type: UPDATE_RACK,
  newRack
})

// export const setVisibilityFilter = (filter) => ({
//   type: 'SET_VISIBILITY_FILTER',
//   filter
// })

// export const toggleTodo = (id) => ({
//   type: 'TOGGLE_TODO',
//   id
// })
