import { MAKE_TILE_EDITABLE } from '../constants/actions'

const defaultState = {
  x: null, y: null
}

const tiles = (state = defaultState, action) => {
  switch (action.type) {
    case MAKE_TILE_EDITABLE:
      return {
        ...state,
        coordinates: action.coordinates
      }
    case 'TOGGLE_TODO':
      return state.map(todo =>
        (todo.id === action.id) 
          ? {...todo, completed: !todo.completed}
          : todo
      )
    default:
      return state
  }
}

export default tiles
