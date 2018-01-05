import { 
  UPDATE_RACK,
  HIGHLIGHT_SUGGESTED_WORD
} from '../constants/actions'


// Rack
export const updateRack = (letters) => ({
  type: UPDATE_RACK,
  letters
})

// WordsList
export const highlightWordOnBoard = (wordCoordinates) => ({
  type: HIGHLIGHT_SUGGESTED_WORD,
  wordCoordinates
})


const playWord = () => ({
  type: 'ASDF'  
})

const resetRack = () => ({
  type: 'ASDF'  
})

// Playword Thunk
export const playWordAndResetRack = (wordInfo) => {
  return (dispatch, getState) => {
    dispatch(playWord(wordInfo))
    dispatch(resetRack())
  }
}
