import React, { Component } from 'react'
import { connect } from 'react-redux'

import { toggleGameType } from '../../_actions/tileBoard'
import ToggleGameType from './ToggleGameType'

class ToggleGameTypeContainer extends Component {
  render() {  
    return(
      <ToggleGameType
        gameType={ this.props.gameType }
        toggleGameType={ this.props.toggleGameType }
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    gameType: state.gameType.gameType
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleGameType: () => {
    dispatch(toggleGameType())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ToggleGameTypeContainer)