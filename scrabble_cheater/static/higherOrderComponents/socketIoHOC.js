import React, { Component } from 'react'
import io from 'socket.io-client'

export default (WrappedComponent) => {
  class socketIoHOC extends Component {
    constructor(props) {
      super(props)
      this.socket = io()

      this.state = {
        suggestedWords: null
      }

      this.socket.on('play', (suggestedWords) => {
        const parsedWords = JSON.parse(suggestedWords)
        this.setState({ suggestedWords: parsedWords })
      })
    }

    render() {
      return (
        <WrappedComponent 
          { ...this.props }
          sendData={ this.sendData }
          suggestedWords={ this.state.suggestedWords }
          socket={ this.socket }
        />
      )
    } 
  }

  return socketIoHOC
}