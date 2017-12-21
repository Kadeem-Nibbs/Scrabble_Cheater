import React, { Component } from 'react'
import io from 'socket.io-client'
import shortid from 'shortid'

export default (WrappedComponent) => {
  class socketIoHOC extends Component {
    constructor(props) {
      super(props)
      this.socket = io('localhost:5000')

      this.state = {
        suggestedWords: null,
        loading: false
      }

      this.socket.on('play', (suggestedWords) => {
        const parsedWords = JSON.parse(suggestedWords)

        this.setState({ suggestedWords: parsedWords }, () => {
          this.toggleLoadingState()
        })
      })
    }

    toggleLoadingState = () => {
      this.setState({ loading: !this.state.loading })
    }

    render() {
      return (
        <WrappedComponent 
          { ...this.props }
          sendData={ this.sendData }
          suggestedWords={ this.state.suggestedWords }
          socket={ this.socket }
          loading={ this.state.loading }
          toggleLoadingState={ this.toggleLoadingState }
        />
      )
    } 
  }

  return socketIoHOC
}