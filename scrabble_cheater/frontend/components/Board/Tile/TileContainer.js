import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import classNames from 'classnames'
import { isEqual, some } from 'lodash'

import { 
  setMoveDirection,
  resetDirectionAndMakeTileEditable, 
  changeValueMoveToNextTile
} from '../../../_actions/tileBoard'

import TileDisplay from './TileDisplay'
import TileEdit from './TileEdit'

class TileContainer extends Component {
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

    if(this.props.cellCharacter !== nextProps.cellCharacter) {
      return true
    }

    return false
  }

  render() {
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
  const coordinatesToHighlight = state.wordList.present.wordCoordinates
  
  const tileHighlightInfo = coordinatesToHighlight.length ? getHighlightedletter(x, y, coordinatesToHighlight) : null

  return {
    gameType: state.gameType.gameType,
    cellCharacter: state.board.present.tiles[y][x],
    tileIsEditable: editableX === x && editableY === y,
    direction: state.tile.present.direction,
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TileContainer)