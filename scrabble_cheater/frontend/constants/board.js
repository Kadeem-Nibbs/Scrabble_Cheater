// Should get these passed up from the backend on `connected` to make sure no discrepency happens
export const scores = {
  wwf: {
    trippleWordScore: [[3, 0], [11, 0], [0, 3], [14, 3], [0, 11], [14, 11], [3, 14], [11, 14]],
    doubleWordScore:   [[5, 1], [9, 1], [7, 3], [1, 5], [13, 5], [3, 7], [11, 7], [1, 9], [13, 9], [7, 11], [5, 13], [9, 13]],
    trippleLetterScore: [[6, 0], [8, 0], [3, 3], [11, 3], [5, 5], [9, 5], [0, 6], [14, 6], [0, 8], [14, 8], [5, 9], [9, 9], [3, 11], [11, 11], [6, 14], [8, 14]],
    doubleLetterScore:  [[2, 1], [12, 1], [1, 2], [4, 2], [10, 2], [13, 2], [2, 4], [6, 4], [8, 4], [12, 4], [4, 6], [10, 6], [4, 8], [10, 8], [2, 10], [6, 10], [8, 10], [12, 10], [1, 12], [4, 12], [10, 12], [13, 12], [2, 13], [12, 13]]
  },
  scrabble: {
    trippleWordScore: [[0, 0],[7, 0],[14, 0],[0, 7],[14, 7],[0, 14],[7, 14],[14, 14]],
    doubleWordScore:  [[1, 1],[13, 1],[2, 2],[12, 2],[3, 3],[11, 3],[4, 4],[10, 4],[7, 7],[4, 10],[10, 10],[3, 11],[11, 11],[2, 12],[12, 12],[1, 13],[13, 13]],
    trippleLetterScore: [[5, 1],[9, 1],[1, 5],[5, 5],[13, 5],[1, 9],[5, 9],[9, 5],[9, 9],[13, 9],[5, 13],[9, 13]],
    doubleLetterScore: [[3, 0],[11, 0],[6, 2],[8, 2],[0, 3],[7, 3],[14, 3],[2, 6],[6, 6],[8, 6],[12, 6],[3, 7],[11, 7],[2, 8],[6, 8],[8, 8],[12, 8],[0, 11],[7, 11],[14, 11],[6, 12],[8, 12],[3, 14],[11, 14]]
  }
}

export const WORDS_WITH_FRIENDS = 'wwf'
export const SCRABBLE = 'scrabble'

export const NUMBER_OF_ROWS = 15
export const NUMBER_OF_COLS = 15
export const TOTAL_TILES = NUMBER_OF_ROWS * NUMBER_OF_COLS

// classNames
export const BTN_UNDO = 'btn-undo'
export const BTN_REDO = 'btn-redo'