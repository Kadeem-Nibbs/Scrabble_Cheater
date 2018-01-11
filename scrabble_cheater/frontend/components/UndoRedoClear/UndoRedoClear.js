import React, { Component } from 'react'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Button } from 'semantic-ui-react'

import { clearBoard } from '../../_actions/tileBoard'

import { BTN_UNDO, BTN_REDO, BTN_CLEAR } from '../../constants/board'

import './UndoRedoClear.less'
class UndoRedoClear extends Component {
  render() {
    return(
      <p className="undo-redo">
        <span className={ classNames({ 'disabled': !this.props.canUndo } ) }>
          <Button 
            className={ BTN_UNDO }
            disabled={!this.props.canUndo}
            onClick={this.props.onUndo} 
          >
            Undo
          </Button>
        </span>
        <span className={ classNames({ 'disabled': !this.props.canRedo } ) }>
          <Button 
            className={ BTN_REDO }
            disabled={ !this.props.canRedo }
            onClick={ this.props.onRedo }
          >
            Redo
          </Button>
        </span>
        <span className={ classNames({ 'disabled': !this.props.canUndo  && !this.props.canRedo } ) }>
          <Button 
            className={ BTN_CLEAR }
            disabled={ !this.props.canUndo  && !this.props.canRedo }
            onClick={ this.props.clearBoard }
          >
            Clear All
          </Button>
        </span>
      </p>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    canUndo: state.board.past.length > 0,
    canRedo: state.board.future.length > 0
  }
}

const mapDispatchToProps = ({
  onUndo: UndoActionCreators.undo,
  onRedo: UndoActionCreators.redo,
  clearBoard: clearBoard
})


export default connect(mapStateToProps, mapDispatchToProps)(UndoRedoClear)
