import React, { Component } from 'react'
import { connect } from 'react-redux'

import { toggleGameType } from '../../_actions'
import ToggleGameType from './ToggleGameType'

class ToggleGameTypeContainer extends Component {
  render() {  
    return(
      <ToggleGameType
        gameType={ this.props.gameType }
        dispatchToggleGameType={ this.props.dispatchToggleGameType }
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    gameType: state.board.gameType
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchToggleGameType: () => {
      dispatch(toggleGameType())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToggleGameTypeContainer)