import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateRack, submitTableData, receivedTableData } from '../../_actions'

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
    rack: state.getWords.rack,
    loading: state.getWords.loading
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
      // triggered by socketIoHOC receiving data from API
      dispatch(receivedTableData(suggestedWords))
    }
  }
}

export default socketIoHOC(connect(mapStateToProps, mapDispatchToProps)(RackContainer))
