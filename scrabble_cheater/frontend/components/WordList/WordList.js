import React, { Component } from 'react'
import classNames from 'classnames'

import { times } from 'lodash'
import { Menu, Label } from 'semantic-ui-react'

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
          letter: wordArray[i]
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
          letter: wordArray[i]
        })
      }
    }

    return coordinates
  }

  handleMouseEnter = (e, wordInfo, i) => {
    e.preventDefault()
    const wordCoordinates = this.getCoordinatesToHighlight(wordInfo)
    let wordHoveredKey = i
    this.setState({ wordHoveredKey })
    this.props.handleHighlightWordOnHover(wordCoordinates)
  }

  handleMouseLeave = (e) => {
    this.props.handleHighlightWordOnHover([])
  }

  handleAddWord = (wordInfo) => {
    this.props.handlePlayWord(wordInfo)
    this.handleMouseLeave() // un-highlight word added (could make a thunk ?)
  }

  render() {
    if(this.props.suggestedWords === null) {
      return(
        <Menu 
          vertical 
          className="scrollable"
        >
          <Menu.Item>
            <h4>Update the Rack, and Get Words!</h4>
          </Menu.Item>
        </Menu>
      )
    }

    return(
      <Menu 
        vertical 
        className="scrollable"
        onMouseLeave={ this.handleMouseLeave }
      >
        { 
          this.props.suggestedWords && this.props.suggestedWords.length === 0 ?
          (    
            <Menu.Item>
              No possible words with this rack
            </Menu.Item>
          
          ) : (
          
          this.props.suggestedWords.map((wordInfo, i) => {
            const word = wordInfo[0]
            const points = wordInfo[3]

            return(
                <Menu.Item
                  className={ classNames({ 'active': this.state.wordHoveredKey === i }) }
                  key={ i }
                  onMouseEnter={ (e) => this.handleMouseEnter(e, wordInfo, i) }
                >
                  {`${ word } is worth ${points} points`}
                   <Label onClick={ this.handleAddWord.bind(this, wordInfo) }>
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