import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

import classNames from 'classnames'

class Tile extends Component {
  shouldComponentUpdate(nextProps) {
    // So we don't re-render every single cell on hover over
    const oldTile = this.shouldUpdateCell(this.props)
    const newTile = this.shouldUpdateCell(nextProps)

    if(oldTile || newTile) {
      return true
    }

    return false
  }

  shouldUpdateCell = (props) => {
    const { cellsToHighlight, tileNumber } = props

    return cellsToHighlight.includes(tileNumber)
  }

  handleTileClick = () => {
    console.log('handleTileOver', this.props);

  }


  render() {
    const { 
      tileNumber,
      wordChars,
      cellsToHighlight
    } = this.props


    const tileInner = {
      margin: '3px',
      color: '#333',
      backgroundColor: 'white',
      height: '30px',
      width: '30px',
      display: 'inline-block'
    }

    const highlightCell = this.shouldUpdateCell(this.props)
    let char = ' '
    let indexOfChar = null

    if(highlightCell) {
      indexOfChar = cellsToHighlight.indexOf(tileNumber)
      char =  wordChars[indexOfChar]
    } else {

      char = this.props.cellData
    } 
  
    return (
      <Table.Cell
        selectable
        textAlign='center'
        className={ classNames({ 'highlight-word-location': highlightCell }) }
        onClick={ this.handleTileClick }
      >
        { char }
      </Table.Cell>
    )
  } 
}

export default Tile