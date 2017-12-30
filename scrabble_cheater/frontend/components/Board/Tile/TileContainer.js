import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Input, Button } from 'semantic-ui-react'
import classNames from 'classnames'

import { 
  setMoveDirection,
  resetDirectionAndMakeTileEditable, 
  changeValueMoveToNextTile, 
  changeValueMoveToNextTileWithArrowKeys,
} from '../../../_actions'

import TileDisplay from './TileDisplay'
import TileEdit from './TileEdit'

class TileContainer extends Component {

  // shouldComponentUpdate(nextProps) {
  //   if(this.props.gameType !== nextProps.gameType) {
  //     return true
  //   }

  //   // Update if this Tile is marked as editable or remove from being editable
  //   if(nextProps.tileIsEditable || nextProps.tileIsEditable !== this.props.tileIsEditable) {
  //     return true
  //   }
    
  //   // This seems super expensive to have in shouldComponentUpdate
  //   const oldTile = this.shouldCellUpdate(this.props)
  //   const newTile = this.shouldCellUpdate(nextProps)

  //   if(oldTile || newTile) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  shouldComponentUpdate(nextProps) {
    return nextProps.tileIsEditable || (nextProps.tileIsEditable !== this.props.tileIsEditable)
  }

  // componentWillReceiveProps(nextProps, nextState) {
  //   if(nextProps.cellCharacter && !this.state.newTileValue) {
  //     // So when a user is adding new letters to the board, 
  //     // if a one is added via menu, it stays when they are auto placed into it
  //     this.setState({ 
  //       newTileValue: nextProps.cellCharacter
  //     })
  //   }
  // }

  // shouldCellUpdate = (props) => {
  //   // This is super expensive. Need to make this way better. 
  //   // Maybe go back to using the cell# instead of x/y coords for faster lookup


  //   // TODO: Hold a flat version of this or something in props an do a compare against that so you dont have to 
  //   //   use forEach on every hover :: this is stupid expensive

  //   let update = false
  //   props.coordinatesToHighlight.forEach((coordinate) => {
  //     if((coordinate.x === this.props.coordinates.x) && (coordinate.y === this.props.coordinates.y)) {
  //       update = true
  //     }
  //   })

  //   return update
  // }

  // handleFocus = (e) => {
  //   e.target.select()
  // }

  // handleSubmitTile = (e) => {
  //   if(e) { 
  //     // incase user hits enter without choosting a direction
  //     e.preventDefault()  
  //   }
  //   const direction = this.props.moveDirection ? this.props.moveDirection : this.state.direction
  //   this.props.handleTileValueChanged(this.state.newTileValue, this.props.coordinates, direction)
  // }

  // handleMoveRight = () => {
  //   this.setState({ direction: 'right' }, () => this.handleSubmitTile() )
  // }

  // handleMoveDown = () => {
  //   this.setState({ direction: 'down' }, () => this.handleSubmitTile() )
  // }

  // handleArrowPress = (e) => {
  //   if(e.key === 'ArrowDown') {
  //     this.handleMoveDown()
  //   } else if(e.key === 'ArrowRight') {
  //     this.handleMoveRight()
  //   } 

  //   if(!this.state.direction && e.key === 'Enter') {
  //     // submit is picked up by form's onSubmit so don't need to handle submit tile also
  //     this.setState({ direction: 'right' })
  //   }
  // }

  render() {
    if(this.props.tileIsEditable) {
      return (
        <TileEdit 
          cellCharacter={ this.props.cellCharacter }
          direction={ this.props.direction }

          handleTileSubmit={ this.props.handleTileSubmit }
          handleSubmitWithArrowKey={ this.props.handleSubmitWithArrowKey }

          handleSetMoveDirection={ this.props.handleSetMoveDirection }
        />
      )

    } else {
      return (
        <TileDisplay
          gameType={ this.props.gameType }
          coordinates={ this.props.coordinates }
          cellCharacter={ this.props.cellCharacter }

          handleMakeTileEditable={ this.props.handleMakeTileEditable }
        />
      )
    }
  } 
}


const mapStateToProps = (state, ownProps) => {
  const { x, y } = ownProps.coordinates
  const { editableX, editableY } = state.tile.editableTilecoordinates

  return {
    gameType: state.board.gameType,
    cellCharacter: state.board.boardData[y][x],
    tileIsEditable: editableX === x && editableY === y,
    direction: state.board.direction

    // coordinatesToHighlight: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleMakeTileEditable: () => {
      dispatch(resetDirectionAndMakeTileEditable(ownProps.coordinates))
    },
    handleTileSubmit: (value) => {
      dispatch(changeValueMoveToNextTile(ownProps.coordinates, value))
    },
    handleSubmitWithArrowKey: (direction, value) => {
      // using left / right arrow keys to submit value
      dispatch(changeValueMoveToNextTileWithArrowKeys(ownProps.coordinates, direction, value))
    },
    handleSetMoveDirection: (direction) => {
      dispatch(setMoveDirection(direction))
    },
    
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(TileContainer)