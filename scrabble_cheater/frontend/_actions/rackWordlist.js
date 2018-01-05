import { 
  UPDATE_RACK,
  HIGHLIGHT_SUGGESTED_WORD
} from '../constants/actions'


export const updateRack = (letters) => ({
  type: UPDATE_RACK,
  letters
})

// WordsList
export const highlightWordOnBoard = (wordCoordinates) => ({
  type: HIGHLIGHT_SUGGESTED_WORD,
  wordCoordinates
})