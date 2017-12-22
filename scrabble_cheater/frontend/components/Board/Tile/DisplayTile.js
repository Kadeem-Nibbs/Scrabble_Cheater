import React, { Component } from 'react'
import { Table, Form, Input, Button } from 'semantic-ui-react'
import classNames from 'classnames'

import { scores } from  '../../../constants'

class DisplayTile extends Component {
  handleClick = (e) => {
    e.preventDefault()
    const newClick = true
    this.props.handleMakeTileEditable(this.props.tileCoordinates, newClick) 

    // action => make tile editable
  }

  testForBonusTile = (bonusScoreArray) => {
    return bonusScoreArray.some((elem) => { 
      return (elem[0] === this.props.tileCoordinates.y) && (elem[1] === this.props.tileCoordinates.x) 
    })
    return false
  }

  render() {
    // Get gametype from redux

    let char = this.props.cellChar || ''

    // CSS classes
    let highlightCell = false
    let onBoard = false
    let blankTile = false
    let playedTile = this.props.cellChar ? true : false
    const tw = this.testForBonusTile(scores[this.props.gameType].trippleWordScore)
    const dw = this.testForBonusTile(scores[this.props.gameType].doubleWordScore)
    const tl = this.testForBonusTile(scores[this.props.gameType].trippleLetterScore)
    const dl = this.testForBonusTile(scores[this.props.gameType].doubleLetterScore)

    this.props.coordinatesToHighlight.filter((coordinates) => {
      if(coordinates.x === this.props.tileCoordinates.x && coordinates.y === this.props.tileCoordinates.y) {
        if(coordinates.char.length == 2) {

          let charInfo = coordinates.char.split('')
          char = charInfo[0]
          
          if(charInfo[1] === '#') {
          
            onBoard = true 

          } else if (charInfo[1] === '_') {
          
            blankTile = true
          }
        } else {
          char = coordinates.char
        }
        highlightCell = true
      }
    })

    return (
      <Table.Cell
        selectable
        textAlign='center'
        className={ classNames('tile-bg-color', { 
          'tw': tw,
          'dw': dw,
          'tl': tl,
          'dl': dl,
          'played-tile': playedTile,
          'highlight-word-location': highlightCell,
          'on-board': onBoard
        }) }
        onClick={ this.handleClick }
      >
        <span><div className={ classNames({ 'blank-tile': blankTile })}>{char}</div></span>
      </Table.Cell>
    )
  } 
}

export default DisplayTile