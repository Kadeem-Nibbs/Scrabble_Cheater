import React, { Component } from 'react'
import io from 'socket.io-client'

export default (WrappedComponent) => {
  class socketIoHOC extends Component {
    constructor(props) {
      super(props)

      if (process.env.NODE_ENV === 'development') {
        // Development using `yarn dev` 
        this.socket = io('http://localhost:4000')
      } else {
        // Production uses server.js :: proxies websockets
        this.socket = io()
      }

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