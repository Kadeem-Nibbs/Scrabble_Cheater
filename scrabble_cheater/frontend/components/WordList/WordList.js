import './WordList.less'

import React, { Component } from 'react'
import classNames from 'classnames'

import { times } from 'lodash'
import { Menu } from 'semantic-ui-react'

import Item from './Item'

class WordList extends Component {
  getCoordinatesToHighlight = (itemNumber)  => {
    const wordInfo = this.props.suggestedWords[itemNumber]

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

  handleItemHover = (itemNumber) => {
    const wordCoordinates = this.getCoordinatesToHighlight(itemNumber)
    this.props.handleHighlightWordOnHover(wordCoordinates)
  }

  handleAddWord = (itemNumber) => {
    const wordInfo = this.props.suggestedWords[itemNumber]
    this.props.handlePlayWord(wordInfo)
    this.handleMouseLeave()
  }

  handleMouseLeave = () => {
    this.props.handleHighlightWordOnHover([])
  }

  render() {
    if(this.props.suggestedWords === null) {
      return(
        <Menu 
          vertical 
          className="scrollable"
        >
          <Menu.Item>
            <h4>Update your letters, <br /> and Get Words!</h4>
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
              <h4>No possible words with <br /> these letters.</h4>
            </Menu.Item>
          
          ) : (
          
          this.props.suggestedWords.map((wordInfo, i) => {
            const word = wordInfo[0]
            const points = wordInfo[3]

            return(
                <Item 
                  key={ i }
                  itemNumber={ i }
                  handleItemHover={ this.handleItemHover }
                  handleAddWord={ this.handleAddWord }
                  word={ word }
                  points={ points } 
                />
              )
            })
          )
        }
        
      </Menu>
    )
  }
}

export default WordList