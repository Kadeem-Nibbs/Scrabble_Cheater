import { 
  UPDATE_RACK,
  HIGHLIGHT_SUGGESTED_WORD,
  PLAY_WORD,
  REMOVE_PLAYED_LETTERS_FROM_RACK
} from '../constants/actions'

import { resetSuggestedWords } from './websockets'

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

// Playword Thunk
export const playWordAndResetRackAndSuggestedWords = (wordInfo) => {
  return (dispatch, getState) => {

    dispatch(playWord(wordInfo))

    const wordPlayed = wordInfo[2]
    const currentRack = getState().rack.present.letters

    dispatch(resetRack(wordPlayed, currentRack))
    dispatch(resetSuggestedWords())
  }
}
