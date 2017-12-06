import React, { Component } from 'react'
import { Table, Form, Input } from 'semantic-ui-react'

import classNames from 'classnames'

class Tile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newTileValue: ''
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.inputRef) {
      this.inputRef.focus() 
    }
  }

  shouldComponentUpdate(nextProps) {
    // If this Tile is marked as editable
    if(nextProps.makeTileEditable || nextProps.makeTileEditable !== this.props.makeTileEditable) {
      return true
    }

    // Only update tiles that are being highlighted because of Word Hover
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
    this.props.handleTileClick(this.props.tileNumber, this.inputRef) 
  }

  handleChangeTileValue = (event, data) => {
    const { value } = data
    if(value.length > 1) {
      return 
    } else {
      this.setState({ newTileValue: value })
    }
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

    if(this.props.makeTileEditable) {
      return (
        <Table.Cell>
          <Form onSubmit={ this.props.tileValueChanged.bind( this.state.newTileValue, tileNumber ) }>
            <Input 
              value={ this.state.newTileValue } 
              onChange={ this.handleChangeTileValue } 
              ref={ (ref) => { this.inputRef = ref }}
            />
          </Form>
        </Table.Cell>
      )

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