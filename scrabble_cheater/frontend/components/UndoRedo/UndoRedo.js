import React, { Component } from 'react'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'

class UndoRedo extends Component {
  render() {
    return(
      <p>
        <button onClick={this.props.onUndo} disabled={!this.props.canUndo}>
          Undo
        </button>
        <button onClick={this.props.onRedo} disabled={!this.props.canRedo}>
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
