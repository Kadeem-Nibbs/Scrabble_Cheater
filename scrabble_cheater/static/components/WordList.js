import React, { Component } from 'react'
import classNames from 'classnames'

class WordList extends Component {
  constructor(props) {
    super(props) 

    this.state = {
      wordHoveredKey: null
    }
  }

  getCellsToHighlightArray = (lowEnd, highEnd, horizontal)  => {
    let list = []
    if(horizontal) {
      for (let i = lowEnd; i <= highEnd; i++) {
        list.push(i)
      }
    } else {
      for (let i = lowEnd; i <= highEnd; i += 15) {
        list.push(i)
      }
    }

    return list
  }

  handleWordOver = (wordInfo, i) => {
    // eg [[3, 5]
    const startOfWord = wordInfo[1][0]
    // eg [3, 12]]
    const endOfWord   = wordInfo[1][1]

    // Note: 
    // startOfWord[0] === y / row
    // startOfWord[1] === x / col

    const rowStart = (startOfWord[0] * 15) - 15
    const startCell = rowStart + startOfWord[1]

    const rowEnd = (endOfWord[0] * 15)  - 15
    const endCell = rowEnd + endOfWord[1]

    const horizontal = startOfWord[0] === endOfWord[0] // if start of word Y is the same as end of word Y its horizontal

    const cellsToHighlight = this.getCellsToHighlightArray(startCell, endCell, horizontal)

    this.setState({ 
      cellsToHighlight,
      wordHoveredKey: i,
      wordChars: wordInfo[2],
    })
  }

  handleWordOut = () => {
    this.setState({
      cellsToHighlight: [],
      wordHoveredKey: null, 
    })
  }


  buildList = () => {
    const wordList = []

    this.props.words.forEach((wordInfo, i) => {
      const word = wordInfo[0]
      const points = wordInfo[3]

      wordList.push(
        <div
          className={ classNames({ 'hover-word': this.state.wordHoveredKey === i }) }
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