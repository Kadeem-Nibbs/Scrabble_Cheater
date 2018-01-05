import { 
  UPDATE_RACK,
  REMOVE_PLAYED_LETTERS_FROM_RACK
} from '../constants/actions'

const defaultState = { letters: '' }

const rack = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_RACK:      
      return {
        ...state,
        letters: action.letters
      }
    case REMOVE_PLAYED_LETTERS_FROM_RACK:
      // TODO: could refactor this to be nicer to read im sure
      const { wordPlayed, currentRack } = action

      // split rack into array 
      let newRack = currentRack.split('').slice()
      // copy word
      let wordPlayedClone = wordPlayed.slice()

      for(let i = wordPlayedClone.length; i--;) {
        if(wordPlayedClone[i].length === 2 && wordPlayedClone[i][1] !== '_') {
          delete wordPlayedClone[i] // delete tiles that are already on board
        }
      }
      // get rid of empty cells
      wordPlayedClone = wordPlayedClone.join('').split('').slice()

      for(let i = wordPlayedClone.length; i--;) {
        if(newRack.includes(wordPlayedClone[i])) {
          let indexOfCellToRemove = newRack.indexOf(wordPlayedClone[i])

          delete newRack[indexOfCellToRemove]
          delete wordPlayedClone[i]
        }
      }

      // get rid of undefined's and turn into string
      newRack = newRack.join('') 

      return {
        ...state,
        letters: newRack
      }
    default:
      return state
  }
}

export default rack
