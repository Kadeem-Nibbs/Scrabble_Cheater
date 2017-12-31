import React, { Component } from 'react'
import { Grid, Input, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'

import { highlightWordOnBoard } from '../../_actions'

import WordList from './WordList'
class WordListContainer extends Component {
  render() {  
    return(
      <WordList 
        words={ this.props.suggestedWords }

        addWordToTable={ this.props.addWordToTable } // need to do 
        handleHighlightWordOnHover={ this.props.handleHighlightWordOnHover } // doing
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
    handleHighlightWordOnHover:(wordCoordinates) => {
      dispatch(highlightWordOnBoard(wordCoordinates))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordListContainer)