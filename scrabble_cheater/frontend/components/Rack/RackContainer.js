import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateRack } from '../../_actions/rackWordlist'
import { submitTableData, receivedTableData } from '../../_actions/websockets'

import socketIoHOC from '../socketIoHOC'
import Rack from './Rack'

class RackContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if(nextProps.suggestedWords) {
      this.props.receiveRack(nextProps.suggestedWords)
    }
  }

  render() {  
    return(
      <Rack 
        rack={ this.props.rack }
        loading={ this.props.loading }

        handleUpdateRack={ this.props.handleUpdateRack }
        submitRack={ this.props.submitRack }
      />
    )
  } 
}

const mapStateToProps = (state, ownProps) => {
  return { 
    rack: state.rack.present.letters,
    loading: state.websockets.loading
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleUpdateRack:(letters) => {
      dispatch(updateRack(letters))
    },
    submitRack:() => {
      dispatch(submitTableData(ownProps.socket))
    },
    receiveRack:(suggestedWords) => {
      // triggered by socketIoHOC receiving data from API
      dispatch(receivedTableData(suggestedWords))
    }
  }
}

export default socketIoHOC(connect(mapStateToProps, mapDispatchToProps)(RackContainer))
