import React, { Component } from 'react'
import classNames from 'classnames'
import { Table } from 'semantic-ui-react'

import Tile from './Tile'

const tilesAcross = 15
const tilesDown = 15
const totalTiles = tilesAcross * tilesDown

// Some missing data
 
// json.dumps( ('MIMICKED', ((3, 5), (3, 12)), ('M', 'I', '_', 'I', 'K', 'E', 'D'), 75) )
// json.dumps( ('MIMICKED', ((3, 5), (3, 12)), ('_', 'I', 'M', 'I', 'K', 'E', 'D'), 75) )
// json.dumps( ('MISLIKED', ((5, 6), (5, 13)), ('M', 'I', '_', 'I', 'K', 'E', 'D'), 67) )
// json.dumps( ('MISLIKED', ((5, 6), (12, 6)), ('M', 'I', '_', 'I', 'K', 'E', 'D'), 55) )

const mockWordData = [
              // row column
              // y start   / x start
  ["MIMICKED", [[3, 5], [3, 12]], ["M", "I", "_", "I", ":C:", "K", "E", "D"], 75],
  ["MIMICKED", [[3, 5], [3, 12]], ["_", "I", "M", "I", ":C:", "K", "E", "D"], 75],
  ["MISLIKED", [[5, 6], [5, 13]], ["M", "I", "_", ":L:", "I","K", "E", "D"], 67],
  ["MISLIKED", [[5, 6], [12, 6]], ["M", "I", "_", ":L:", "I", "K", "E", "D"], 55]
]

// Server expects data in this format
const initialTableData = {
  1:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  2:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  3:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  4:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  5:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  6:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  7:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  8:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  9:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  10: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  11: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  12: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  13: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  14: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  15: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ]
}

const initialState = {
  wordHoveredKey: null,
  cellsToHighlight: [],
  wordChars: '',
  editableTile: null,
  tableData: initialTableData 
}

class Board extends Component {
  constructor(props) {
    super(props)
    this.state = { ...initialState }
  }

  // Highlight word logic
  getCellsToHighlightArray = (lowEnd, highEnd, horizontal)  => {
    let list = []
    if(horizontal) {
      for (let i = lowEnd; i <= highEnd; i++) {
        list.push(i)
      }
    } else {
      for (let i = lowEnd; i <= highEnd; i += 15) {
        list.push(i)
      }
    }
    return list
  }

  handleWordOver = (wordInfo, i) => {
    // [[3, 5]
    const startOfWord = wordInfo[1][0]
    //  [3, 12]]
    const endOfWord   = wordInfo[1][1]

    // Note: 
    // startOfWord[0] === y / row
    // startOfWord[1] === x / col

    const rowStart = (startOfWord[0] * 15) - 15
    const startCell = rowStart + startOfWord[1] - 1

    const rowEnd = (endOfWord[0] * 15)  - 15
    const endCell = rowEnd + endOfWord[1] - 1

    const horizontal = startOfWord[0] === endOfWord[0] // if start of word Y is the same as end of word Y its horizontal

    const cellsToHighlight = this.getCellsToHighlightArray(startCell, endCell, horizontal)

    this.setState({ 
      cellsToHighlight,
      wordHoveredKey: i,
      wordChars: wordInfo[2],
    })
  }

  handleWordOut = () => {
    this.setState({
      cellsToHighlight: [],
      wordHoveredKey: null, 
    })
  }

  showWordList = () => {
    const wordList = []

    mockWordData.forEach((wordInfo, i) => {
      const word = wordInfo[0]
      const points = wordInfo[3]

      wordList.push(
        <div
          className={ classNames({ 'hover-word': this.state.wordHoveredKey === i }) }
          key={ i }
          onMouseEnter={ this.handleWordOver.bind(this, wordInfo, i) }
          onMouseOut={ this.handleWordOut.bind(this, wordInfo, i) }
        >
          {`${ word } is worth ${points} points`}
        </div>
      )
    })

    return wordList
  }

  // Edit tile logic
  handleTileClick = (tileNumber) => {
    this.setState({ editableTile: tileNumber })
  }

  tileValueChanged = (newTileValue, cellNumber, tileNumber) => {

    console.log('newTileValue, cellNumber, tileNumber', newTileValue, cellNumber, tileNumber);
    const cellNumberParsed = parseInt(cellNumber)

    // Calculate row 
    const row = Math.floor(tileNumber / 15) + 1
    const newRowState = this.state.tableData[row].slice(0)

    newRowState[cellNumberParsed] = newTileValue.toUpperCase()

    const newState = Object.assign({}, this.state.tableData )

    newState[row] = newRowState

    this.setState({
      editableTile: null,
      tableData: newState,
      wordChars: ''
    })
  }

  // Build board logic
  buildBoard = () => {
    const board = []
    // These three vars get altered when endRow is true
    let row =[] 
    let rowNumber = 1
    let cellNumber = 1

    for(let i = 0; i < totalTiles; i++) {   
      const tileNumber = i
      const endRow = (tileNumber + 1) % 15 === 0 ? true : false

      row.push(
        <Tile
          cellNumber={ cellNumber }
          tileValueChanged={ this.tileValueChanged }
          tileIsEditable={ this.state.editableTile === tileNumber }
          key={ tileNumber }
          handleTileClick={ this.handleTileClick }
          tileNumber={ tileNumber } 
          cellsToHighlight={ this.state.cellsToHighlight }
          wordChars={ this.state.wordChars }
          cellData={ this.state.tableData[rowNumber][cellNumber ] }
        />
      )

      cellNumber ++

      if(endRow) {
        board.push(
          <Table.Row 
            key={ rowNumber } 
            children={row} 
          />
        )

        row = [] // reset row / head to next row / and reset cell we are at
        rowNumber += 1
        cellNumber = 1
      }
    }

    return board
  }

  render() {
    return (
      <div className="scrabble-container">
        <div>
          Word List
          { this.showWordList()  }
        </div>

        <Table celled>
          <Table.Body>
            { this.buildBoard() }
          </Table.Body>
        </Table>
      </div>
    )
  } 
}

export default Board