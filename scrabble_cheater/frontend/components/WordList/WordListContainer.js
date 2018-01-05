import React, { Component } from 'react'
import { Grid, Input, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'

import { highlightWordOnBoard } from '../../_actions/rackWordlist'

import WordList from './WordList'
class WordListContainer extends Component {
  render() {
    return(
      <WordList 
        words={ this.props.suggestedWords }

        handleAddWordToTable={ this.props.handleAddWordToTable } // need to do 
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
    },
    handleAddWordToTable:(wordList, i ) => {
      console.log('add word', wordList, i);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordListContainer)