import React, { Component } from 'react'
import io from 'socket.io-client'
import shortid from 'shortid'

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

        suggestedWordsFormatted = parsedWords.map((wordInfo) => {
          console.log('wordInfo', wordInfo);
          
          return {
            ...wordInfo
          }
        })

        this.setState({ suggestedWords: suggestedWordsFormatted }, () => {

          this.toggleLoadingState()
        })
      })
    }

    // This is so <Tile /> can be far more perfomant when looking up what to highlight. 
    calculateSquaresToHighlight = () => {

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