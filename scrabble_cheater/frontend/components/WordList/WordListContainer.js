import React, { Component } from 'react'
import { Grid, Input, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'

import WordList from './WordList'
class WordListContainer extends Component {
  render() {  
    return(
      <WordList 
        words={ this.props.suggestedWords } 

        addWordToTable={ this.props.addWordToTable }
        wordHoveredKey={ this.props.wordHoveredKey }
        handleHighlightWordOnHover={ this.props.handleHighlightWordOnHover }
      />
    )
  } 
}

const mapStateToProps = (state, ownProps) => {
  return { 
    suggestedWords: state.getWords.suggestedWords
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSomething:() => {
      // dispatch(updateRack(value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordListContainer)