import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import {  resetDirectionAndMakeTileEditable } from '../../_actions/tileBoard'

import Board from './Board'

class BoardContainer extends Component {
  render() {
    return (
      <Board stopEditingTiles={ this.props.stopEditingTiles } />
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