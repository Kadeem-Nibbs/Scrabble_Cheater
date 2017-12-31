import React, { Component } from 'react'
import classNames from 'classnames'

import { times } from 'lodash'
import { Menu, Label, Button } from 'semantic-ui-react'

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

  handleWordOver = (e, wordInfo, i) => {
    const coordinatesToHighlight = this.getCoordinatesToHighlight(wordInfo)
    let wordHoveredKey = i
    this.setState({ wordHoveredKey })

    this.props.handleHighlightWordOnHover(coordinatesToHighlight)
  }

  handleWordOut = () => {
    this.props.handleHighlightWordOnHover([], null)
  }

  handleAddWordToTable = (wordInfo, i) => {
    this.props.addWordToTable(wordInfo, i)
    this.handleWordOut() // un-highlight word added
  }

  render() {
    return(
      <Menu 
        vertical 
        className="scrollable"
        onMouseOut={ this.handleWordOut }
      >
        { 
          this.props.words && this.props.words.length === 0 ?
          (    
            <Menu.Item>
              No possible words with this rack
            </Menu.Item>
          
          ) : (
          
          this.props.words.map((wordInfo, i) => {
            const word = wordInfo[0]
            const points = wordInfo[3]

            return(
                <Menu.Item
                  className={ classNames({ 'active': this.state.wordHoveredKey === i }) }
                  key={ i }
                  onMouseEnter={ (e) => this.handleWordOver(e, wordInfo, i) }
                  onMouseDown={ (e) => this.handleWordOver(e, wordInfo, i)}
                >
                  {`${ word } is worth ${points} points`}
                   <Label onClick={ this.handleAddWordToTable.bind(this, wordInfo, i) }>
                      <i 
                        className="fa fa-plus-circle" 
                        aria-hidden="true"
                      ></i>
                   </Label>
                </Menu.Item>
              )
            })
          )
        }
        
      </Menu>
    )
  }
}

export default WordList