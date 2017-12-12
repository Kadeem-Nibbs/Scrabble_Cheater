import React, { Component } from 'react'
import io from 'socket.io-client'

export default (WrappedComponent) => {
  class socketIoHOC extends Component {
    constructor(props) {
      super(props)
      this.socket = io()

      this.state = {
        suggestedWords: null,
        loading: false
      }

      this.socket.on('play', (suggestedWords) => {
        const parsedWords = JSON.parse(suggestedWords)
        console.log('Words', parsedWords.length);

        this.setState({ suggestedWords: parsedWords }, () => {

          this.toggleLoadingState()
        })
      })
    }

    toggleLoadingState = () => {
      console.log('Loading', this.state.loading);
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