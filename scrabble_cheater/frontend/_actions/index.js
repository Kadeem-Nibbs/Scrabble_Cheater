import { 
  MAKE_TILE_EDITABLE, 
  TOGGLE_GAME_TYPE 
} from '../constants/'

export const makeTileEditable = (coordinates) => ({
  type: MAKE_TILE_EDITABLE,
  coordinates
})

export const toggleGameType = () => ({
  type: TOGGLE_GAME_TYPE
})

// export const setVisibilityFilter = (filter) => ({
//   type: 'SET_VISIBILITY_FILTER',
//   filter
// })

// export const toggleTodo = (id) => ({
//   type: 'TOGGLE_TODO',
//   id
// })
