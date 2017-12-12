import React, { Component } from 'react'
import classNames from 'classnames'
import { Container, Grid, Table, Button, Input, Loader } from 'semantic-ui-react'
import socketIoHOC from '../higherOrderComponents/socketIoHOC'

import WordList from './WordList'
import Tile from './Tile'

const tilesAcross = 15
const tilesDown = 15
const totalTiles = tilesAcross * tilesDown

// Server expects data in this format
const initialTableData = [
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ]
]

const initialState = {
  coordinatesToHighlight: [],
  wordChars: '',
  rack: '',
  editableTileCoordinates: {
    x: null,
    y: null
  },
  gameType:'wordWithFriends',
  moveDirection: 'right',
  tableData: initialTableData,
  wordHoveredKey: null,
  loading: false
}

class Board extends Component {
  constructor(props) {
    super(props)
    this.state = { ...initialState }

    this.wrapperRef = null

    const gameType = localStorage.getItem('gameType')
    if(gameType) {
      this.setState({ gameType })
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.loading !== this.props.loading) {
      this.setState({ 
        loading: nextProps.loading 
      })
    }
  }

  // For clicking outside of tile area
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({
        editableTileCoordinates: {
          x: null,
          y: null
        }
      })
    }
  }

  // handle table data
  handleSendTableData = () => {
    const tableData =  {
      gameType: this.state.gameType,
      board: this.state.tableData,
      rack: this.state.rack
    }

    this.props.socket.emit('analyze_board', JSON.stringify(tableData), () => {
      this.props.toggleLoadingState()
    })
  }

  // Edit tile logic
  handleTileClick = (tileCoordinates) => {
    this.setState({ editableTileCoordinates: tileCoordinates})
  }

  handleTileValueChanged = (newTileValue, tileCoordinates) => {
    // Calculate row 
    const row = tileCoordinates.y
    const newRowState = this.state.tableData[row]
    const newState = this.state.tableData

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
      if(this.state.moveDirection === 'right') {
        if(tileCoordinates.x === 14) {
          return
        } else {
          newTileCoordinates.x = tileCoordinates.x + 1
        }
      } else if(this.state.moveDirection === 'down') {
        if(tileCoordinates.y === 14) {
          return 
        } else {
          newTileCoordinates.x = tileCoordinates.y + 1
        }
      }

      this.handleTileClick(newTileCoordinates)
    })
  }

  handleHighlightWordOnHover = (coordinatesToHighlight, i) => {
    this.setState({ 
      coordinatesToHighlight: coordinatesToHighlight,
      wordHoveredKey: i
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
          tileIsEditable={ tileIsEditable }
          tileCoordinates={ tileCoordinates } 

          handleTileValueChanged={ this.handleTileValueChanged }
          handleTileClick={ this.handleTileClick }

          coordinatesToHighlight={ this.state.coordinatesToHighlight }
          cellChar={ this.state.tableData[rowNumber][cellNumber] }
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

  handleRackChange = (e, data) => {
    if(data && data.value) {
      this.setState({ 
        rack: data.value.toUpperCase() 
      })
    }
  }

  render() {
    console.log('Board render: | this.props.loading', this.props.loading)

    return (
      <Container className="mt-100px">
        <Grid className="scrabble-container">
          <Grid.Column computer={ 11 }>
            <div ref={ (ref) => { this.wrapperRef = ref  }}>
              <Table celled>
                <Table.Body>
                  { this.buildBoard() }
                </Table.Body>
              </Table>
            </div>
          </Grid.Column>

          <Grid.Column computer={ 5 }>
            <Input 
              value={ this.state.rack } 
              onChange={ this.handleRackChange } 
            />
            <Button 
              onClick={ this.handleSendTableData } 
              disabled={ this.props.loading }
            >
              { this.props.loading ? (<Loader active inline />) : 'Get Words' }
            </Button>

            <WordList 
              words={ this.props.suggestedWords } 
              wordHoveredKey={ this.state.wordHoveredKey }
              handleHighlightWordOnHover={ this.handleHighlightWordOnHover }
            />
          </Grid.Column>
        </Grid>
      </Container>
    )
  } 
}

export default socketIoHOC(Board)