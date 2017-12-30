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
      blankTile: false,
      tl: false,
      dw: false,
      tl: false,
      dl: false
    }
  }

  componentWillMount() {
    this.setSpecialScoreTiles()
  }

  componentDidUpdate(prevProps) {
    if(this.props.gameType !== prevProps.gameType) {
      this.setSpecialScoreTiles()
    }

    if(this.props.coordinatesToHighlight && this.props.cellCharacter == 2) {
      this.setSpecialCssClass()
    }
  }

  checkForBonusTile = (bonusScoreArray) => {
    return bonusScoreArray.some((elem) => { 
      return (elem[0] === this.props.coordinates.y) && (elem[1] === this.props.coordinates.x) 
    })
    return false
  }

  setSpecialCssClas = () => {
    let onBoard = false
    let blankTile = false
    let highlightCell = false

    if(some(this.props.coordinatesToHighlight, this.props.coordinates)) {
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

  setSpecialScoreTiles = () => {
    const tw = this.checkForBonusTile(scores[this.props.gameType].trippleWordScore)
    const dw = this.checkForBonusTile(scores[this.props.gameType].doubleWordScore)
    const tl = this.checkForBonusTile(scores[this.props.gameType].trippleLetterScore)
    const dl = this.checkForBonusTile(scores[this.props.gameType].doubleLetterScore)

    this.setState({ tw, dw, tl, dl })
  }

  render() {
    // The reason for [0] is: for display purposes, if this has two chars to designate 'empty' or 'existing' tile, 
    // we only want to display the first character. so 'Z_'[0] will display 'Z'
    let char = this.props.cellCharacter[0] 
    let playedTile = this.props.cellCharacter ? true : false

    return (
      <Table.Cell
        selectable
        textAlign='center'
        className={ classNames('tile-bg-color', { 
          'tw': this.state.tw,
          'dw': this.state.dw,
          'tl': this.state.tl,
          'dl': this.state.dl,
          'played-tile': playedTile,
          'highlight-word-location': this.state.highlightCell,
          'on-board': this.state.onBoard
        }) }
        onClick={ this.props.handleMakeTileEditable }
      >
        <span><div className={ classNames({ 'blank-tile': this.state.blankTile })}>{char}</div></span>
      </Table.Cell>
    )
  } 
}

export default DisplayTile