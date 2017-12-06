import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

import classNames from 'classnames'

class Tile extends Component {
  shouldComponentUpdate(nextProps) {
    if(nextProps.makeTileEditable || nextProps.makeTileEditable !== this.props.makeTileEditable) {
      return true
    }

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

  handleClick = () => {
    this.props.handleTileClick(this.props.tileNumber) 
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
    
      console.log('this.props.makeTileEditable', this.props.makeTileEditable);
    if(this.props.makeTileEditable) {

      return (<input type="text" />)
    } else {
      return (
        <Table.Cell
          selectable
          textAlign='center'
          className={ classNames({ 'highlight-word-location': highlightCell }) }
          onClick={ this.handleClick }
        >
          { char }
        </Table.Cell>
      )
    }
  } 
}

export default Tile