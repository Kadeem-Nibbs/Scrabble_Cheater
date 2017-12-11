import React, { Component } from 'react'
import io from 'socket.io-client'

export default (WrappedComponent) => {
  class socketIoHOC extends Component {
    constructor(props) {
      super(props)
      this.socket = io()

      this.state = {
        tableData: null
      }

      this.socket.on('play', (tableData) => {
        console.log('tableData', tableData);

        this.setState({ tableData })
      })
    }

    render() {
      return (
        <WrappedComponent 
          { ...this.props }
          sendData={ this.sendData }
          tableData={ this.state.tableData }
          socket={ this.socket }
        />
      )
    } 
  }

  return socketIoHOC
}