import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { BTN_UNDO, BTN_REDO } from '../../constants/board'
import {  resetDirectionAndMakeTileEditable } from '../../_actions/tileBoard'

import { Table } from 'semantic-ui-react'

import Board from './Board'

class BoardContainer extends Component {
  constructor(props) {
    super(props)
    this.wrapperRef = null
  }

  // For clicking outside of tile area
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = (e) => {
    // We dont want to trigger this if the user is clicking an 'undo' button
    const undoButton = e.target.className === BTN_UNDO || e.target.className === BTN_REDO

    if (this.wrapperRef && !this.wrapperRef.contains(e.target) && !undoButton) {
      this.props.stopEditingTiles()
    }
  }

  render() {
    return (
      <div ref={ (ref) => { this.wrapperRef = ref  }}>
        <Table unstackable celled>
          <Board />
        </Table>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    stopEditingTiles: (e) => {
      dispatch(resetDirectionAndMakeTileEditable({ x: null, y: null}))
    }
  }
}

export default connect(null, mapDispatchToProps)(BoardContainer)