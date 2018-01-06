import React, { Component } from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import { updateRack } from '../../_actions/rackWordlist'
import { submitTableData, receivedTableData } from '../../_actions/websockets'

import Rack from './Rack'

class RackContainer extends Component {
  constructor(props) {
    super(props)
    if (process.env.NODE_ENV === 'development') {
      // Development using `yarn dev` 
      this.socket = io('http://localhost:4000')
    } else {
      // Production uses server.js :: proxies websockets
      this.socket = io()
    }

    this.socket.on('play', (suggestedWords) => {
      const parsedWords = JSON.parse(suggestedWords)

      this.props.receiveRack(parsedWords)
    })
  }

  submitRack = () => {
    this.props.submitRack(this.socket)
  }

  render() {  
    return(
      <Rack 
        rack={ this.props.rack }
        loading={ this.props.loading }

        handleUpdateRack={ this.props.handleUpdateRack }
        submitRack={ this.submitRack }
      />
    )
  } 
}

const mapStateToProps = (state, ownProps) => {
  return { 
    rack: state.rack.present.letters,
    loading: state.websockets.present.loading
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleUpdateRack:(letters) => {
      dispatch(updateRack(letters))
    },
    submitRack:(socket) => {
      dispatch(submitTableData(socket))
    },
    receiveRack:(suggestedWords) => {
      // triggered by socketIoHOC receiving data from API
      dispatch(receivedTableData(suggestedWords))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RackContainer)
