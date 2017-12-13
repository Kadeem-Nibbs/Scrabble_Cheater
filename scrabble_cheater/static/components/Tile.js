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


    // TODO: Hold a flat version of this or something in props an do a compare against that so you dont have to 
    //   use forEach on every hover :: this is stupid expensive
    let update = false
    props.coordinatesToHighlight.forEach((coordinate) => {
      if((coordinate.x === this.props.tileCoordinates.x) && (coordinate.y === this.props.tileCoordinates.y)) {
        update = true
      }
    })

    return update
  }

  handleClick = () => {
    const newClick = true
    this.props.handleMakeTileEditable(this.props.tileCoordinates, newClick) 
  }

  updateStateWithTileValue = (event, data) => {
    const { value } = data
    if(value.length > 1) {
      return 
    } else {
      this.setState({ newTileValue: value })
    }
  }

  handleSelectGoRight = () => {
    this.props.handleSelectDirection('right', this.props.tileCoordinates)
  }

  handleSelectGoDown = () => {
    this.props.handleSelectDirection('down', this.props.tileCoordinates)
  }

  render() {
    let char = this.props.cellChar || ''
    let highlightCell = false
    const colorClass = ''

    // TODO: same as above :: make less expensive. Save in props or something. 
    // Maybe go back to tile #'s so you don't have to do searching through objects / arrays ?
    // Not too sure
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
          <Form onSubmit={ this.props.handleTileValueChanged.bind(this, this.state.newTileValue, this.props.tileCoordinates, this.props.moveDirection) }>
            <Input 
              pattern='[A-Za-z]'
              onInvalid={ (event) => { event.target.setCustomValidity('Please enter a Letter')} }
              onInput={ (event) => { event.target.setCustomValidity('')} }
              value={ this.state.newTileValue } 
              onChange={ this.updateStateWithTileValue } 
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
            { this.props.moveDirection ?
                (<Button className="btn-tile-submit" type='submit'> <i className="fas fa-plus"></i> </Button>) :
                (
                  <span>
                    <Button 
                      className="btn-tile-submit" 
                      onClick={ this.props.handleTileValueChanged.bind(this, this.state.newTileValue, this.props.tileCoordinates, 'right') }
                      type='submit'
                    > 
                      <i className="fas fa-arrow-right"></i> 
                    </Button>
                    <Button 
                      className="btn-tile-submit down-arrow" 
                      onClick={ this.props.handleTileValueChanged.bind(this, this.state.newTileValue, this.props.tileCoordinates, 'down') }>  
                        <i className="fas fa-arrow-down"></i>  
                      </Button>
                  </span>
                )
            }
          </Form>
        </Table.Cell>
      )

    } else {
      console.log('render');
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