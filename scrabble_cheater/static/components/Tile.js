import React, { Component } from 'react'
import { Table, Form, Input, Button } from 'semantic-ui-react'

import classNames from 'classnames'

class Tile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newTileValue: ''
    }
  }

  componentDidUpdate() {
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
          <Form onSubmit={ this.props.tileValueChanged.bind(this, this.state.newTileValue, this.props.cellNumber, tileNumber ) }>
            <Input 
              pattern='[A-Za-z]'
              onInvalid={ (event) => { event.target.setCustomValidity('Please enter a letter')} }
              onInput={ (event) => { event.target.setCustomValidity('')} }
              value={ this.state.newTileValue } 
              onChange={ this.handleChangeTileValue } 
              ref={ (ref) => { this.inputRef = ref }}
              onFocus={(event) => {
                // rediculous: you have to do this
                // to get cursor to be at the end of the
                // text in the input when you re-click it
                const { target } = event
                const { value }= target
                event.target.value = ''
                event.target.value = value
              }}
            />
            <Button className="btn-tile-submit" type='submit'>+</Button>
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