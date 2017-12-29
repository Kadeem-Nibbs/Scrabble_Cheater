import React, { Component } from 'react'
import { connect } from 'react-redux'

import updateRack from '../../_actions'

import Rack from './Rack'

class RackContainer extends Component {
  render() {  
    return(
      <Rack 
        rack={ this.props.rack }
      />
    )
  } 
}

const mapStateToProps = (state, ownProps) => {
  return { 
    rack: state.rack.value
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // dispatchToggleGameType: () => {
    //   dispatch(toggleGameType())
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RackContainer)
