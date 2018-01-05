import { 
  UPDATE_RACK,
  HIGHLIGHT_SUGGESTED_WORD,
  PLAY_WORD,
  REMOVE_PLAYED_LETTERS_FROM_RACK,
  CLEAR_SUGGESTED_WORDS
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

const resetRack = () => ({
  type: REMOVE_PLAYED_LETTERS_FROM_RACK
})

const clearSuggestedWords = () => ({
  type: CLEAR_SUGGESTED_WORDS
})

// Playword Thunk
export const playWordAndResetRack = (wordInfo) => {
  return (dispatch, getState) => {

    console.log('getState()', getState());

    dispatch(playWord(wordInfo))

    const playedWords = 'abcde'
    dispatch(resetRack(playedWords))
    dispatch(clearSuggestedWords())
  }
}


// () => {
//       // Wordlist - just reset it all 
//     const newSuggestedWordsList = this.state.suggestedWords.slice()
//     delete newSuggestedWordsList[wordIndexInSuggestedWords]

//     // Recalculate rack
//     // Todo: split out into array
//     let currentRack = this.state.rack.split('').slice()
//     let wordPlayed = wordInfo[2].slice()

//     // todo: yeesh this is all unreadable, refactor when less rushed
//     for(let i = wordPlayed.length; i--;) {
//       if(wordPlayed[i].length === 2 && wordPlayed[i][1] !== '_') {
//         delete wordPlayed[i] // delete tiles that are already on board
//       }
//     }

//     wordPlayed = wordPlayed.join('').split('').slice() // get rid of empty cells

//     for(let j = wordPlayed.length; j--;) {
//       if(currentRack.includes(wordPlayed[j])) {
//         let indexOfCellToRemove = currentRack.indexOf(wordPlayed[j])

//         delete currentRack[indexOfCellToRemove]
//         delete wordPlayed[j]
//       }
//     }

//     currentRack = currentRack.join('') // get rid of undefined's and turn into string
// }
