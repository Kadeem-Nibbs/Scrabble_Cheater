import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateRack, sendTableData } from '../../_actions'

import Rack from './Rack'

class RackContainer extends Component {
  render() {  
    return(
      <Rack 
        rack={ this.props.rack }
        handleUpdateRack={ this.props.handleUpdateRack }
        handleSendTableData={ this.props.handleSendTableData }
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
    handleUpdateRack: (value) => {
      dispatch(updateRack(value))
    },
    handleSendTableData: () => {
      dispatch(sendTableData())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RackContainer)
