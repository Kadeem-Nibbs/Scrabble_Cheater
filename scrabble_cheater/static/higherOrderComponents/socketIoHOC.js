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

        console.log('parsedWords.length', parsedWords.length);

        // const suggestedWordsFormatted = parsedWords.map((wordInfo, i) => {
        //   return calculateSquaresToHighlight(wordInfo)
        // })

        this.setState({ suggestedWords: parsedWords }, () => {

          this.toggleLoadingState()
        })
      })
    }

    addCellToLetts = () => {
      const startOfWord = wordInfo[1][0]
      const endOfWord   = wordInfo[1][1]

    }

    // This is so <Tile /> can be _way_ more perfomant when looking up what to highlight.
    //  With of answers above 1000, looking up x/y on hover over is sort of slow.
    //  Giving the exact tile to highlight is way faster.
    calculateSquaresToHighlight = (wordInfo) => {

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