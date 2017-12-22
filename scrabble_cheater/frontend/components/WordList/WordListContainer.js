import React, { Component } from 'react'
import { Grid, Input, Button } from 'semantic-ui-react'

import WordList from './WordList'
class WordListContainer extends Component {
  render() {  
    return(
      <WordList 
        words={ this.state.suggestedWords } 
        addWordToTable={ this.addWordToTable }
        wordHoveredKey={ this.state.wordHoveredKey }
        handleHighlightWordOnHover={ this.handleHighlightWordOnHover }
      />
    )
  } 
}

export default WordListContainer