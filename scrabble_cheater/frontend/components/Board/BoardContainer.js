import React, { Component } from 'react'
import classNames from 'classnames'

import { connect } from 'react-redux'

import { 
  Container, 
  Grid, 
  Table, 
  Button, 
  Input, 
  Loader, 
  Label, 
  Icon, 
  Header, 
  Popup, 
  Radio
} from 'semantic-ui-react'


import socketIoHOC from '../socketIoHOC'
import TileContainer from './Tile/TileContainer'

import Board from './Board'

// Server expects data in this format

// const initialState = {
//   coordinatesToHighlight: [],
//   wordChars: '',
//   rack: '',
//   editableTileCoordinates: {
//     x: null,
//     y: null
//   },
//   moveDirection: null, // will be either 'down' or 'right'
//   tableData: null,
//   wordHoveredKey: null,
//   loading: false,
//   suggestedWords: null
// }

// Todo: push some of this logic into this into WordListContainer and TileContainer so this file is less huge
class BoardContainer extends Component {
  constructor(props) {
    super(props)
    // this.state = { ...initialState, tableData: this.props.boardState }

    this.wrapperRef = null

    // const gameType = localStorage.getItem('gameType')
    // if(gameType) {
    //   this.setState({ gameType })
    // } // do this somewhere else
  }

  // componentWillReceiveProps(nextProps) {
  //   if(nextProps.loading !== this.props.loading) {
  //     this.setState({ 
  //       loading: nextProps.loading 
  //     })
  //   }

  //   if(this.props.suggestedWords) {
  //     this.setState({ suggestedWords: this.props.suggestedWords })
  //   }
  // }

  // For clicking outside of tile area
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (e) => {

    // Disable for a sec
    // making all the tiles re-render like every time - fix this
    // if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
    //   this.setState({
    //     editableTileCoordinates: {
    //       x: null,
    //       y: null
    //     },
    //     moveDirection: null
    //   })
    // }
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

    // todo: split out into array
    let currentRack = this.state.rack.split('').slice()
    let wordPlayed = wordInfo[2].slice()

    // todo: yeesh this is all unreadable, refactor when less rushed
    for(let i = wordPlayed.length; i--;) {
      if(wordPlayed[i].length === 2 && wordPlayed[i][1] !== '_') {
        delete wordPlayed[i] // delete tiles that are already on board
      }
    }

    wordPlayed = wordPlayed.join('').split('').slice() // get rid of empty cells

    for(let j = wordPlayed.length; j--;) {
      if(currentRack.includes(wordPlayed[j])) {
        let indexOfCellToRemove = currentRack.indexOf(wordPlayed[j])

        delete currentRack[indexOfCellToRemove]
        delete wordPlayed[j]
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
      gameType: this.props.gameType,
      board: this.state.tableData,
      rack: this.state.rack
    }

    this.props.socket.emit('analyze_board', JSON.stringify(tableData))
  }

  // handleMakeTileEditable = (tileCoordinates, newClick) => {
  //   // If this is being called from <Tile />, its a new click so the user hasn't
  //   //   set a direction yet.
  //   if(newClick) {
  //     this.setState({ 
  //       moveDirection: null,
  //       editableTileCoordinates: tileCoordinates 
  //     })
  //   } else {
  //     // If this is being called from handleTileValueChanged(), keep going the same direction
  //     this.setState({  editableTileCoordinates: tileCoordinates  })
  //   }
  // }

  // handleTileValueChanged = (newTileValue, tileCoordinates, moveDirection) => {
  //   // Calculate row 
  //   const row = tileCoordinates.y
  //   const newRowStateRow = this.state.tableData[row]
  //   const newState = this.state.tableData
  //   newRowStateRow[tileCoordinates.x] = newTileValue.toUpperCase()
  //   newState[row] = newRowStateRow

  //   // Allow user to select a move direction before inputs a value
  //   if(!newTileValue && moveDirection) {
  //     this.setState({ moveDirection }, () => {
  //       this.handleMakeTileEditable(tileCoordinates)
  //     })
  //     return
  //   }

  //   this.setState({
  //     editableTileCoordinates: {
  //       x: null,
  //       y: null
  //     },
  //     tableData: newState,
  //     wordChars: '',
  //     initialRack: '',
  //     moveDirection: moveDirection
  //   }, () => {

  //     const newTileCoordinates = Object.assign({}, tileCoordinates)
  //     // If horizontal
  //     if(this.state.moveDirection === 'right') {
  //       if(tileCoordinates.x === 14) {
  //         return
  //       } else {
  //         newTileCoordinates.x = tileCoordinates.x + 1
  //       }
  //     } else if(this.state.moveDirection === 'down') {
  //       if(tileCoordinates.y === 14) {
  //         return 
  //       } else {
  //         newTileCoordinates.y = tileCoordinates.y + 1
  //       }
  //     }

  //     this.handleMakeTileEditable(newTileCoordinates)
  //   })
  // }

  handleHighlightWordOnHover = (coordinatesToHighlight, i) => {
    this.setState({ 
      coordinatesToHighlight: coordinatesToHighlight,
      wordHoveredKey: i
    })
  }

  render() {
    return (
      <div ref={ (ref) => { this.wrapperRef = ref  }}>
        <Table unstackable celled>
          <Board />
        </Table>
      </div>
    )
  }
}

export default BoardContainer