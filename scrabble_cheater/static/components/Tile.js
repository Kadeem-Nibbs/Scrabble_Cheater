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
    // Update if this Tile is marked as editable or remove from being editable
    if(nextProps.tileIsEditable || nextProps.tileIsEditable !== this.props.tileIsEditable) {
      return true
    }
    
    // This seems super expensive to have in shouldComponentUpdate
    const oldTile = this.shouldCellUpdate(this.props)
    const newTile = this.shouldCellUpdate(nextProps)

    if(oldTile || newTile) {
      return true
    } else {
      return false
    }

  }

  shouldCellUpdate = (props) => {
    // This is super expensive. Need to make this way better. 
    // Maybe go back to using the cell# instead of x/y coords for faster lookup

    let update = false
    props.coordinatesToHighlight.forEach((coordinate) => {
      if((coordinate.x === this.props.tileCoordinates.x) && (coordinate.y === this.props.tileCoordinates.y)) {
        update = true
      }
    })

    return update
  }

  handleClick = () => {
    this.props.handleTileClick(this.props.tileCoordinates) 
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
    let char = this.props.cellChar || ''
    let highlightCell = false
    const colorClass = ''

    this.props.coordinatesToHighlight.filter((coordinates) => {
      if(coordinates.x === this.props.tileCoordinates.x && coordinates.y === this.props.tileCoordinates.y) {
        // Set char 
        char = coordinates.char
        highlightCell = true
      }
    })

    const middleTile = this.props.tileCoordinates.x == 7 && this.props.tileCoordinates.y == 7 ? true : false

    if(this.props.tileIsEditable) {
      return (
        <Table.Cell>
          <Form onSubmit={ this.props.handleTileValueChanged.bind(this, this.state.newTileValue, this.props.tileCoordinates) }>
            <Input 
              pattern='[A-Za-z]'
              onInvalid={ (event) => { event.target.setCustomValidity('Please enter a Letter')} }
              onInput={ (event) => { event.target.setCustomValidity('')} }
              value={ this.state.newTileValue } 
              onChange={ this.handleChangeTileValue } 
              ref={ (ref) => { this.inputRef = ref }}
              onFocus={(event) => {
                // ridiculous: you have to do this
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
          className={ classNames({ 'highlight-word-location': highlightCell, 'middle-tile': middleTile }) }
          onClick={ this.handleClick }
        >
          { char }
        </Table.Cell>
      )
    }
  } 
}

export default Tile