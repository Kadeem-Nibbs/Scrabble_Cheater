import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateRack, submitTableData, receivedTableData } from '../../_actions'

import socketIoHOC from '../socketIoHOC'
import Rack from './Rack'

class RackContainer extends Component {
  componentWillReceiveProps(nextProps) {
    console.log('nextProps.suggestedWords', nextProps.suggestedWords);
    if(nextProps.suggestedWords) {
      this.props.receiveRack(nextProps.suggestedWords)
    }
  }
  render() {  
    return(
      <Rack 
        rack={ this.props.rack }
        handleUpdateRack={ this.props.handleUpdateRack }
        submitRack={ this.props.submitRack }
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
    handleUpdateRack:(value) => {
      dispatch(updateRack(value))
    },
    submitRack:() => {
      dispatch(submitTableData(ownProps.socket))
    },
    receiveRack:(suggestedWords) => {
      dispatch(receivedTableData(suggestedWords))
    }
  }
}

export default socketIoHOC(connect(mapStateToProps, mapDispatchToProps)(RackContainer))
