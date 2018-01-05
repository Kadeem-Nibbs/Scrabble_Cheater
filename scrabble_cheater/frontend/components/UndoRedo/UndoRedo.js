import React, { Component } from 'react'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'

import { BTN_UNDO, BTN_REDO } from '../../constants/board'

class UndoRedo extends Component {
  render() {
    return(
      <p>
        <button 
          className={ BTN_UNDO }
          disabled={!this.props.canUndo}
          onClick={this.props.onUndo} 
        >
          Undo
        </button>
        <button 
          className={ BTN_REDO }
          disabled={!this.props.canRedo}
          onClick={this.props.onRedo}
        >
          Redo
        </button>
      </p>
    )
  }
}

const mapStateToProps = (state) => ({
  canUndo: state.board.past.length > 0,
  canRedo: state.board.future.length > 0
})

const mapDispatchToProps = ({
  onUndo: UndoActionCreators.undo,
  onRedo: UndoActionCreators.redo
})

export default connect(mapStateToProps, mapDispatchToProps)(UndoRedo)
