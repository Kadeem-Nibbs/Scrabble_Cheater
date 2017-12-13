import React, { Component } from 'react'
import classNames from 'classnames'
import { Container, Grid, Table, Button, Input, Loader, Label, Icon, Header, Popup } from 'semantic-ui-react'
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
  moveDirection: null, // will be either 'down' or 'right'
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
        },
        moveDirection: null
      })
    }
  }

  // handle table data
  handleSendTableData = () => {
    this.props.toggleLoadingState()

    const tableData =  {
      gameType: this.state.gameType,
      board: this.state.tableData,
      rack: this.state.rack
    }

    this.props.socket.emit('analyze_board', JSON.stringify(tableData), () => {
      
    })
  }

  handleMakeTileEditable = (tileCoordinates, newClick) => {
    // If this is being called from <Tile />, its a new click so the user hasn't
    //   set a direction yet.
    if(newClick) {
      this.setState({ 
        moveDirection: null,
        editableTileCoordinates: tileCoordinates 
      })
    } else {
      // If this is being called from handleTileValueChanged(), keep going the same direction
      this.setState({  editableTileCoordinates: tileCoordinates  })
    }
  }

  handleTileValueChanged = (newTileValue, tileCoordinates, moveDirection) => {
    console.log('newTileValue, tileCoordinates, moveDirection', newTileValue, tileCoordinates, moveDirection);
    // Calculate row 
    const row = tileCoordinates.y
    const newRowState = this.state.tableData[row]
    const newState = this.state.tableData
    newRowState[tileCoordinates.x] = newTileValue.toUpperCase()
    newState[row] = newRowState

    // Allow user to select a move direction before inputs a value
    if(!newTileValue && moveDirection) {
      this.setState({ moveDirection }, () => {
        this.handleMakeTileEditable(tileCoordinates)
      })
      return
    }

    this.setState({
      editableTileCoordinates: {
        x: null,
        y: null
      },
      tableData: newState,
      wordChars: '',
      initialRack: '',
      moveDirection: moveDirection
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
          newTileCoordinates.y = tileCoordinates.y + 1
        }
      }

      this.handleMakeTileEditable(newTileCoordinates)
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
          moveDirection={ this.state.moveDirection }

          handleTileValueChanged={ this.handleTileValueChanged }
          handleMakeTileEditable={ this.handleMakeTileEditable }

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
    const rack = data.value || ''
    console.log('data.value', data.value)
    if(rack.length <= 7) {
      this.setState({ 
        rack: data.value.toUpperCase() 
      })
    }
  }

  render() {
    return (
      <Container className="mt-60px">
        <Header as='h2'>
          Words With Fiends
          <Header.Subheader>
            Generate answers for Words With Friends or Scrabble 
            <Popup
              trigger={<Button className="info-popover" icon='question' />}
              content="Enter your rack to the right, add all played letters to the board below, and you're good to go!"
            />
          </Header.Subheader>
        </Header>
        <Grid className="scrabble-container">
          <Grid.Column computer={ 7 }>
            <div ref={ (ref) => { this.wrapperRef = ref  }}>
              <Table celled>
                <Table.Body>
                  { this.buildBoard() }
                </Table.Body>
              </Table>
            </div>
          </Grid.Column>

          <Grid.Column computer={ 5 }>
            <Label>
              <Icon name='info' /> use <span className="big-underscore">_</span> for blank tiles
            </Label>
            <Grid>
              <Grid.Column computer={ 8 }>
                <Input 
                  placeholder="Enter your rack..."
                  className="rack"
                  value={ this.state.rack } 
                  onChange={ this.handleRackChange } 
                />
              </Grid.Column>
              <Grid.Column computer={ 8 }>
                <Button 
                  className="btn-get-word"
                  type="submit"
                  onClick={ this.handleSendTableData } 
                  disabled={ this.props.loading }
                >
                  { this.props.loading ? (<Loader size='tiny' active inline />) : 'Get Words' }
                </Button>
              </Grid.Column>
            </Grid>

            <WordList 
              words={ this.props.suggestedWords } 
              wordHoveredKey={ this.state.wordHoveredKey }
              handleHighlightWordOnHover={ this.handleHighlightWordOnHover }
            />
          </Grid.Column>
          <div computer={ 4 }></div>
        </Grid>
      </Container>
    )
  } 
}

export default socketIoHOC(Board)