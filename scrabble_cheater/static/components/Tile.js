import React, { Component } from 'react'
import { Table, Form, Input, Button } from 'semantic-ui-react'
import classNames from 'classnames'

class Tile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newTileValue: '',
      direction: null
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

  componentWillReceiveProps(nextProps, nextState) {
    if(nextProps.cellChar && !this.state.newTileValue) {
      // So when a user is adding new letters to the board, 
      // if a one is added via menu, it stays when they are auto placed into it
      this.setState({ 
        newTileValue: nextProps.cellChar 
      })
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

  handleClick = (e) => {
    e.preventDefault()
    const newClick = true
    this.props.handleMakeTileEditable(this.props.tileCoordinates, newClick) 
  }

  updateStateWithTileValue = (event, data) => {
    const { value } = data

    if(value.length == 0) {
      this.setState({ newTileValue: ''})
    } else if(value.length > 1 ) {
      return 
    } 


    if(/^[A-Za-z_]+$/.test(value)) {
      this.setState({ newTileValue: value.toUpperCase() }, () => {
        if(this.state.direction || this.props.moveDirection) {
          this.handleSubmitTile()
        }
      })
    } else {
      return
    }
  }

  handleFocus = (e) => {
    e.target.select()
  }

  handleSubmitTile = (e) => {
    if(e) { 
      // incase user hits enter without choosting a direction
      e.preventDefault()  
    }
    const direction = this.props.moveDirection ? this.props.moveDirection : this.state.direction
    this.props.handleTileValueChanged(this.state.newTileValue, this.props.tileCoordinates, direction)
  }

  handleMoveRight = () => {
    this.setState({ direction: 'right' }, () => this.handleSubmitTile() )
  }

  handleMoveDown = () => {
    this.setState({ direction: 'down' }, () => this.handleSubmitTile() )
  }

  handleArrowPress = (e) => {
    if(e.key === 'ArrowDown') {
      this.handleMoveDown()
    } else if(e.key === 'ArrowRight') {
      this.handleMoveRight()
    }
  }

  render() {
    let char = this.props.cellChar || ''
    let highlightCell = false
    const colorClass = '' // for stuff
    let onBoard = false
    let blankTile = false

    // TODO: same as above :: make less expensive. Save in props or something. 
    // Maybe go back to tile #'s so you don't have to do searching through objects / arrays ?
    // Not too sure
    this.props.coordinatesToHighlight.filter((coordinates) => {
      if(coordinates.x === this.props.tileCoordinates.x && coordinates.y === this.props.tileCoordinates.y) {
        // Set char 
        // TODO: SOMETHING HERE TO SIGNIFY IT ALREADY EXISTS ON THE BOARD - highlight or something
        // console.log('char', char);
        // console.log('coordinates.char', coordinates.char);
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

    const middleTile = this.props.tileCoordinates.x == 7 && this.props.tileCoordinates.y == 7 ? true : false

    if(this.props.tileIsEditable) {
      return (
        <Table.Cell>
          <form className="ui form" onSubmit={ this.handleSubmitTile }>
            <Input 
              onKeyDown={ this.handleArrowPress }
              value={ this.state.newTileValue } 
              onChange={ this.updateStateWithTileValue } 
              ref={ (ref) => { this.inputRef = ref }}
              onFocus={ this.handleFocus }
            />
            { this.props.moveDirection ? // todo: move this to function its huge
              // TODO: figure out how to get patthern="XX" to trigger from right / down arrorws
                (
                  <Button 
                    type="button"
                    className={ classNames("btn-tile-submit", this.props.moveDirection === 'down' ? 'move-down' : null) } 
                    onClick={ this.handleSubmitTile }
                  > 
                    <i className="fas fa-plus"></i> 
                  </Button>
                ) :
                (
                  <span>
                    <Button 
                      type="button"
                      className="btn-tile-submit right-arrow"
                      onClick={ this.handleMoveRight }
                    > 
                      <i className="fas fa-arrow-right"></i> 
                    </Button>
                    <Button 
                      type="button"
                      className="btn-tile-submit down-arrow" 
                      onClick={ () => { 
                          this.setState({ direction: 'down' }, () => this.handleSubmitTile() )
                        }
                      }
                    >  
                        <i className="fas fa-arrow-down"></i>  
                      </Button>
                  </span>
                )
            }
          </form>
        </Table.Cell>
      )

    } else {
      console.log('render');
      return (
        <Table.Cell
          selectable
          textAlign='center'
          className={ classNames({ 
            'highlight-word-location': highlightCell, 
            'middle-tile': middleTile, 
            'on-board': onBoard,   
            'blank-tile': blankTile,   
          }) }
          onClick={ this.handleClick }
        >
          { char }
        </Table.Cell>
      )
    }
  } 
}

export default Tile