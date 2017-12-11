import React, { Component } from 'react'
import classNames from 'classnames'
import { Table, Button } from 'semantic-ui-react'
import socketIoHOC from '../higherOrderComponents/socketIoHOC'

import WordList from './WordList'
import Tile from './Tile'

const tilesAcross = 15
const tilesDown = 15
const totalTiles = tilesAcross * tilesDown

const mockWordData = [
              // row column
              // y start   / x start
  ["MIMICKED", [[3, 5], [3, 12]], ["M", "I", "_", "I", "$C", "K", "E", "D"], 75],
  ["MIMICKED", [[3, 5], [3, 12]], ["_", "I", "M", "I", "$C", "K", "E", "D"], 75],
  ["MISLIKED", [[5, 6], [5, 13]], ["M", "I", "_", "$L", "I","K", "E", "D"], 67],
  ["MISLIKED", [[5, 6], [12, 6]], ["M", "I", "_", "$L", "I", "K", "E", "D"], 55]
]

// Server expects data in this format
const initialTableData = {
  0:  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
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
  14: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ]
}

const initialState = {
  cellsToHighlight: [],
  wordChars: '',
  editableTileCoordinates: {
    x: null,
    y: null
  },
  gameType:'wordWithFriends',
  tableData: initialTableData
}

class Board extends Component {
  constructor(props) {
    super(props)
    this.state = { ...initialState }

    const gameType = localStorage.getItem('gameType')
    if(gameType) {
      this.setState({ gameType })
    }
  }

  sendTableData = () => {
    const flatArray = []
    for(let key in this.state.tableData) {
      flatArray.push(this.state.tableData[key]) 
    }
    this.props.socket.emit('tableData', JSON.stringify(flatArray))
  }

  // Edit tile logic
  handleTileClick = (tileCoordinates) => {
    this.setState({ editableTileCoordinates: tileCoordinates})
  }

  handleTileValueChanged = (newTileValue, tileCoordinates) => {
    // Calculate row 
    const row = tileCoordinates.y
    const newRowState = this.state.tableData[row].slice(0)
    const newState = Object.assign({}, this.state.tableData )

    newRowState[tileCoordinates.x] = newTileValue.toUpperCase()
    newState[row] = newRowState

    this.setState({
      editableTileCoordinates: {
        x: null,
        y: null
      },
      tableData: newState,
      wordChars: '',
      initialRack: ''
    }, () => {
      const newTileCoordinates = Object.assign({}, tileCoordinates)
      // If horizontal
      newTileCoordinates.x = tileCoordinates.x + 1
      this.handleTileClick(newTileCoordinates)
    })
  }

  // Build board logic
  buildBoard = () => {
    const board = []
    // These three vars get altered when endRow is true
    let row =[] 
    let rowNumber = 0
    let cellNumber = 0

    for(let i = 0; i < totalTiles - 1; i++) {   

      const tileCoordinates = { x: cellNumber, y: rowNumber }


      const endRow = (cellNumber === 14) ? true : false

      const tileIsEditable = (
        this.state.editableTileCoordinates.x === cellNumber
      ) && (
        this.state.editableTileCoordinates.y === rowNumber
      ) ? true : false

      row.push(
        <Tile
          key={ i }
          cellNumber={ cellNumber }
          handleTileValueChanged={ this.handleTileValueChanged }
          tileIsEditable={ tileIsEditable }
          handleTileClick={ this.handleTileClick }
          tileCoordinates={ tileCoordinates } 
          cellsToHighlight={ this.state.cellsToHighlight }
          wordChars={ this.state.wordChars }
          cellData={ this.state.tableData[rowNumber][cellNumber] }
        />
      )

      cellNumber++

      if(endRow) {
        board.push(
          <Table.Row 
            key={ rowNumber } 
            children={row} 
          />
        )

        // reset row after its pushed / increment rowNumber to next row / and reset cell we are at
        row = [] 
        rowNumber = rowNumber + 1
        cellNumber = 0
      }
    }

    return board
  }


  render() {
    return (
      <div className="scrabble-container">
        <div>
          Word List
          <WordList words={ mockWordData } />
        </div>

        <Table celled>
          <Table.Body>
            { this.buildBoard() }
          </Table.Body>
        </Table>
        <div>
          { this.props.tableData }
        </div>
        <Button onClick={ this.sendTableData }>
          Get Words
        </Button>
      </div>
    )
  } 
}

export default socketIoHOC(Board)