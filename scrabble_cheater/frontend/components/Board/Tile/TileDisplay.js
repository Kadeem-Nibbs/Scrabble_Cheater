import './TileDisplay.less'

import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { some } from 'lodash'

import { scores } from  '../../../constants/board'

class TileDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      highlightCell: false,
      blankTile: false,
      tl: false,
      dw: false,
      tl: false,
      dl: false
    }
  }

  componentWillMount() {
    this.setSpecialScoreTiles()
    // If user has just entered a blank tile, style properly.
    if(this.props.cellCharacter && this.props.cellCharacter[1]  === '_') {
      this.setState({
        blankTile: true
      })
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.gameType !== prevProps.gameType) {
      this.setSpecialScoreTiles()
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.letterToHighlight !== '') {
      this.setHighlightStyles(nextProps.letterToHighlight)
    } 

    const clearHighlightCell = nextProps.letterToHighlight === '' && this.state.highlightCell
    if(clearHighlightCell) {
      // Reset highlight state
      this.setState({
        blankTile: false,
        highlightCell: false
      })
    }

    // If the tile has been played, and the tile played is blank, 
    // display it with underline
    if(nextProps.cellCharacter && nextProps.cellCharacter[1]  === '_') {
      this.setState({
        blankTile: true
      })
    } else if(!nextProps.cellCharacter && this.state.blankTile) {
      // Reset this.state.blankTile if tile is cleared and it was blank
      this.setState({
        blankTile: false
      })
    }
  }

  setHighlightStyles = (letterToHighlight) => {
    let blankTile = false
    const highlightCell = true

    const letter = letterToHighlight

    if (letter[1] === '_') {
      blankTile = true
    }

    this.setState({
      blankTile,
      highlightCell
    })
  }

  checkForBonusTile = (bonusScoreArray) => {
    return bonusScoreArray.some((elem) => { 
      return (elem[0] === this.props.coordinates.y) && (elem[1] === this.props.coordinates.x) 
    })
    return false
  }

  setSpecialScoreTiles = () => {
    const tw = this.checkForBonusTile(scores[this.props.gameType].trippleWordScore)
    const dw = this.checkForBonusTile(scores[this.props.gameType].doubleWordScore)
    const tl = this.checkForBonusTile(scores[this.props.gameType].trippleLetterScore)
    const dl = this.checkForBonusTile(scores[this.props.gameType].doubleLetterScore)

    this.setState({ tw, dw, tl, dl })
  }

  render() {
    // The reason for [0] is for display purposes, if this has two chars to designate 'empty' or 'existing' tile, 
    // we only want to display the first character. so 'Z_'[0] will display 'Z'
    let letter = ''
    if(this.props.letterToHighlight) {
      letter = this.props.letterToHighlight[0]
    } else if(this.props.cellCharacter){
       letter = this.props.cellCharacter[0]
    }

    let playedTile = this.props.cellCharacter ? true : false
    return (
      <Table.Cell
        textAlign='center'
        className={ classNames('tile-bg-color', { 
          'tw': this.state.tw,
          'dw': this.state.dw,
          'tl': this.state.tl,
          'dl': this.state.dl,
          'played-tile': playedTile,
          'highlight-word-location': this.state.highlightCell
        }) }
        onClick={ this.props.handleMakeTileEditable }
      >
        <div className="hidden-preload-arrows">
          <i className="fas fa-arrow-down"></i><i className="fas fa-arrow-right"></i>
        </div>
        <span><div className={ classNames({ 'blank-tile': this.state.blankTile })}>{letter}</div></span>
      </Table.Cell>
    )
  } 
}

export default TileDisplay