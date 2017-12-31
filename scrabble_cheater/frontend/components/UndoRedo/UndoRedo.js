import React, { Component } from 'react'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'

class UndoRedo extends Component {
  render() {
    console.log('past length', this.props.past);
    console.log('future length', this.props.future);
    console.log('--');
    if(this.props.present){
      console.log('present', this.props.present[0]);
    }
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
  past: state.board.past,
  future: state.board.future,
  present: state.board.present.boardData,
  canUndo: state.board.past.length > 0,
  canRedo: state.board.future.length > 0
})

const mapDispatchToProps = ({
  onUndo: UndoActionCreators.undo,
  onRedo: UndoActionCreators.redo
})

export default connect(mapStateToProps, mapDispatchToProps)(UndoRedo)
