import { 
  UPDATE_RACK,
  HIGHLIGHT_SUGGESTED_WORD,
  PLAY_WORD,
  REMOVE_PLAYED_LETTERS_FROM_RACK,
  HIDE_SUGGESTED_WORDS,
  SHOW_SUGGESTED_WORDS
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


const playWord = (wordInfo) => ({
  type: PLAY_WORD,
  wordInfo
})

const resetRack = (wordPlayed, currentRack) => ({
  type: REMOVE_PLAYED_LETTERS_FROM_RACK,
  wordPlayed, 
  currentRack
})

const hideSuggestedWords = () => ({
  type: HIDE_SUGGESTED_WORDS
})

// Used by ./websockets
export const showSuggestedWords = () => ({
  type: SHOW_SUGGESTED_WORDS
})

// Playword Thunk
export const playWordAndResetRack = (wordInfo) => {
  return (dispatch, getState) => {

    dispatch(playWord(wordInfo))

    const wordPlayed = wordInfo[2]
    const currentRack = getState().rack.letters
    dispatch(resetRack(wordPlayed, currentRack))
    dispatch(hideSuggestedWords())
  }
}
