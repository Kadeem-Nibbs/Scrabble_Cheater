import { 
  MAKE_TILE_EDITABLE, 
  TOGGLE_GAME_TYPE,
  UPDATE_RACK
} from '../constants/actions'

export const toggleGameType = () => {
  return { type: TOGGLE_GAME_TYPE }
}

export const updateRack = (value) => ({
  type: UPDATE_RACK,
  value
})

export const makeTileEditable = (coordinates) => ({
  type: MAKE_TILE_EDITABLE,
  coordinates
})

// export const setVisibilityFilter = (filter) => ({
//   type: 'SET_VISIBILITY_FILTER',
//   filter
// })

// export const toggleTodo = (id) => ({
//   type: 'TOGGLE_TODO',
//   id
// })
