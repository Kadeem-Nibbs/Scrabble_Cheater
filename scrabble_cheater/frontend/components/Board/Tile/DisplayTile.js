import React, { Component } from 'react'
import { Table, Form, Input, Button } from 'semantic-ui-react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { some } from 'lodash'

import { scores } from  '../../../constants/board'

class DisplayTile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      highlightCell: false,
      onBoard: false,
      blankTile: false
    }
  }

  // Check to see if this cell needs to be given a special class
  componentWillReceiveProps = (nextProps) => {
    let onBoard = false
    let blankTile = false
    let highlightCell = false

    if(some(nextProps.coordinatesToHighlight, nextProps.coordinates) && nextProps.cellCharacter == 2) {

      if(charInfo[1] === '#') {
        onBoard = true 
      } else if (charInfo[1] === '_') {
        blankTile = true
      }
      highlightCell = true

      this.setState({
        onBoard,
        blankTile,
        highlightCell
      })

    }
  }

  handleClick = (e) => {
    e.preventDefault()
    const newClick = true
    this.props.handleMakeTileEditable(this.props.coordinates, newClick) 

    // action => make tile editable
  }

  testForBonusTile = (bonusScoreArray) => {
    return bonusScoreArray.some((elem) => { 
      return (elem[0] === this.props.coordinates.y) && (elem[1] === this.props.coordinates.x) 
    })
    return false
  }

  render() {
    // The reason for [0] is: for display purposes, if this has two chars to designate 'empty' or 'existing' tile, 
    // we only want to display the first character. so 'z_'[0] will display 'z'
    let char = this.props.cellCharacter[0] 
    let playedTile = this.props.cellCharacter ? true : false

    const tw = this.testForBonusTile(scores[this.props.gameType].trippleWordScore)
    const dw = this.testForBonusTile(scores[this.props.gameType].doubleWordScore)
    const tl = this.testForBonusTile(scores[this.props.gameType].trippleLetterScore)
    const dl = this.testForBonusTile(scores[this.props.gameType].doubleLetterScore)

    return (
      <Table.Cell
        selectable
        textAlign='center'
        className={ classNames('tile-bg-color', { 
          'tw': tw,
          'dw': dw,
          'tl': tl,
          'dl': dl,
          'played-tile': this.state.playedTile,
          'highlight-word-location': this.state.highlightCell,
          'on-board': this.state.onBoard
        }) }
        onClick={ this.handleClick }
      >
        <span><div className={ classNames({ 'blank-tile': this.state.blankTile })}>{char}</div></span>
      </Table.Cell>
    )
  } 
}

// Seperate this into 'DisplayTileContainer' and 'DisplayTile'
const mapStateToProps = (state, ownProps) => {
  const { x, y } = ownProps.coordinates

  return { 
    coordinatesToHighlight: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    gameType: state.board.gameType,
    cellCharacter: state.board.boardData[y][x],
  }
}

export default connect(mapStateToProps)(DisplayTile)