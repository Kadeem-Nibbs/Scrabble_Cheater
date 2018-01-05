import React, { Component } from 'react'
import io from 'socket.io-client'

export default (WrappedComponent) => {
  class socketIoHOC extends Component {
    constructor(props) {
      super(props)
      // TODO: Move this in .env at some point
      this.socket = io('http://104.131.69.97:4000')

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
          socket={ this.socket }
          suggestedWords={ this.state.suggestedWords }
        />
      )
    } 
  }

  return socketIoHOC
}