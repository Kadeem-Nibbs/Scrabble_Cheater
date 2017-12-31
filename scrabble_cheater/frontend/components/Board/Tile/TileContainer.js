import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { Table, Form, Input, Button } from 'semantic-ui-react'
import classNames from 'classnames'
import { isEqual, some } from 'lodash'

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

  shouldComponentUpdate(nextProps) {
    // This should be taken care of by mapStateToProps but it doesn't figure this out properly
    if(nextProps.tileIsEditable || (nextProps.tileIsEditable !== this.props.tileIsEditable)) {
      return true
    }

    if(this.props.gameType !== nextProps.gameType) {
      return true
    }


    if(this.props.letterToHighlight !== nextProps.letterToHighlight) {
      return true
    }

    return false
  }

  render() {
    // console.log('Tile Container :: Render', this.props.letterToHighlight);
    if(this.props.tileIsEditable) {
      return (
        <TileEdit
          cellCharacter={ this.props.cellCharacter }
          direction={ this.props.direction }

          handleTileSubmit={ this.props.handleTileSubmit }
          undoTilePlacement={ this.props.undoTilePlacement }

          handleSetMoveDirection={ this.props.handleSetMoveDirection }
        />
      )

    } else {
      return (
        <TileDisplay
          gameType={ this.props.gameType }
          coordinates={ this.props.coordinates }
          cellCharacter={ this.props.cellCharacter }
          letterToHighlight={ this.props.letterToHighlight }

          handleMakeTileEditable={ this.props.handleMakeTileEditable }
        />
      )
    }
  } 
}

const getHighlightedletter = (x, y, coordinatesToHighlight) => {
    return coordinatesToHighlight.find((coordinate) => {
      return x === coordinate.x && y === coordinate.y
    })
}

const mapStateToProps = (state, ownProps) => {
  const { x, y } = ownProps.coordinates
  const { editableX, editableY } = state.tile.present
  const coordinatesToHighlight = state.wordList.wordCoordinates
  
  const tileHighlightInfo = coordinatesToHighlight.length ? getHighlightedletter(x, y, coordinatesToHighlight) : null

  return {
    gameType: state.gameType.gameType,
    cellCharacter: state.board.present.boardData[y][x],
    tileIsEditable: editableX === x && editableY === y,
    direction: state.direction.direction,
    letterToHighlight: tileHighlightInfo ? tileHighlightInfo.letter : ''
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
    handleSetMoveDirection: (direction) => {
      dispatch(setMoveDirection(direction))
    },
    undoTilePlacement: () => {
      dispatch(UndoActionCreators.undo()) 
    }
    // handleSubmitWithArrowKey: (direction, value) => {
    //   // using left / right arrow keys to submit value
    //   dispatch(changeValueMoveToNextTileWithArrowKeys(ownProps.coordinates, direction, value))
    // },
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TileContainer)