// todo: REFACTOR THIS TO USE REDUX HOLY HELL

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
  loading: false,
  suggestedWords: null
}

// Todo: push some of this logic into this into WordListContainer and TileContainer so this file is less huge
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

    if(this.props.suggestedWords) {
      this.setState({ suggestedWords: this.props.suggestedWords })
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

  addWordToTable = (wordInfo, wordIndexInSuggestedWords) => {
    // add to table data and update suggested words
    const newData = this.state.tableData.slice()

    const firstY = wordInfo[1][0][0]
    const secondY = wordInfo[1][1][0]

    const firstX = wordInfo[1][0][1]
    const secondX = wordInfo[1][1][1]
    
    const yDistance = secondY - firstY
    const xDistance = secondX - firstX

    if(firstY === secondY)  {

      for(let i = 0; i <= xDistance; i++) {
        newData[firstY][firstX + i] = wordInfo[2][i].length === 2 ? wordInfo[2][i].split('')[0] : wordInfo[2][i]
      }

    } else if (firstX === secondX) {
      
      for(let i = 0; i <= yDistance; i++) {
        newData[firstY + i][firstX] = wordInfo[2][i].length === 2 ? wordInfo[2][i].split('')[0] : wordInfo[2][i]
      }
    }

    const newSuggestedWordsList = this.state.suggestedWords.slice()
    delete newSuggestedWordsList[wordIndexInSuggestedWords]

    // todo: split out into method
    let currentRack = this.state.rack.split('').slice()
    let wordPlayed = wordInfo[2].slice()

    // todo: yeesh this is unreadable, fix
    for(let i = wordPlayed.length; i--;) {
      if(wordPlayed[i].length === 2) {
        delete wordPlayed[i] // delete tiles that are already on board
      }
    }

    wordPlayed = wordPlayed.join('').split('').slice() // get rid of empty cells

    for(let j = wordPlayed.length; j--;) {
      if(wordPlayed.length === 0) {
        break
      }

      if(currentRack.includes(wordPlayed[j])) {
        let indexOfCellToRemove = currentRack.indexOf(wordPlayed[j])
        delete currentRack[indexOfCellToRemove]
        delete wordPlayed[j]

        // wordPlayed = wordPlayed.join('').split('').slice()
      }
    }

    currentRack = currentRack.join('') // get rid of undefined's and turn into string

    this.setState({ 
      tableData: newData,
      suggestedWords: newSuggestedWordsList,
      rack: currentRack
    }, () => {
      if(currentRack.length) {
        this.handleSendTableData()
      } else {
        this.setState({ suggestedWords: null })
      }
    })
  }

  // handle table data
  handleSendTableData = (e) => {
    if(e){ e.preventDefault() }


    this.props.toggleLoadingState()

    // should be false for spaces / special chars besides _
    const tableData =  {
      gameType: this.state.gameType,
      board: this.state.tableData,
      rack: this.state.rack
    }

    this.props.socket.emit('analyze_board', JSON.stringify(tableData))
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
    // Calculate row 
    const row = tileCoordinates.y
    const newRowStateRow = this.state.tableData[row]
    const newState = this.state.tableData
    newRowStateRow[tileCoordinates.x] = newTileValue.toUpperCase()
    newState[row] = newRowStateRow

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

    if(data.value.length === 0) {
      // user highlighted and cleared input
      this.setState({ 
        rack: ''
      })
    }

    if(/^[A-Za-z_]+$/.test(rack) && rack.length <= 7) { 
      // Don't allow weird chars
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
            <form onSubmit={ this.handleSendTableData }>
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
                    disabled={ this.props.loading }
                  >
                    { this.props.loading ? (<Loader size='tiny' active inline />) : 'Get Words' }
                  </Button>
                </Grid.Column>
              </Grid>
            </form>

            <WordList 
              words={ this.state.suggestedWords } 
              addWordToTable={ this.addWordToTable }
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