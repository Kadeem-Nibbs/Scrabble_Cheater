import React, { Component } from 'react'
import classNames from 'classnames'

class WordList extends Component {
  constructor(props) {
    super(props) 

    this.state = {
      wordHoveredKey: null
    }
  }

  getCoordinatesToHighlight = (wordInfo)  => {
    const startOfWord = wordInfo[1][0]
    const endOfWord   = wordInfo[1][1]
    const wordArray = wordInfo[2]

    const horizontal = startOfWord[0] === endOfWord[0]

    let coordinates = []
    if(horizontal) {
      const wordLength =  endOfWord[1] - startOfWord[1]
      const y = startOfWord[0]
      let xCoordinate = startOfWord[1]

      for (let i = 0; i <= wordLength; i++) {
        coordinates.push({
          x: xCoordinate++, 
          y: y,
          char: wordArray[i]
        })
      }
    } else {
      const wordLength = endOfWord[0] - startOfWord[0]
      const x = startOfWord[1]
      let yCoordinate = startOfWord[0]

      for (let i = 0; i <= wordLength; i++) {
        coordinates.push({
          x: x, 
          y: yCoordinate++,
          char: wordArray[i]
        })
      }
    }

    return coordinates
  }

  handleWordOver = (wordInfo, i) => {
    // y x coordinates 
    const coordinatesToHighlight = this.getCoordinatesToHighlight(wordInfo)

    let wordHoveredKey = i

    // need to pass this up on props
    this.props.handleHighlightWordOnHover(coordinatesToHighlight, wordHoveredKey)
  }

  handleWordOut = () => {
    this.props.handleHighlightWordOnHover([], null)
  }


  buildList = () => {
    const wordList = []

    if(!this.props.words) {
      return null
    }

    this.props.words.forEach((wordInfo, i) => {
      const word = wordInfo[0]
      const points = wordInfo[3]

      wordList.push(
        <div
          className={ classNames({ 'hover-word': this.props.wordHoveredKey === i }) }
          key={ i }
          onMouseEnter={ this.handleWordOver.bind(this, wordInfo, i) }
          onMouseOut={ this.handleWordOut.bind(this, wordInfo, i) }
        >
          {`${ word } is worth ${points} points`} | {}
        </div>
      )
    })

    return wordList
  }

  render() {
    return(
      <span>
        { this.buildList() }
      </span>
    )
  }
}

export default WordList