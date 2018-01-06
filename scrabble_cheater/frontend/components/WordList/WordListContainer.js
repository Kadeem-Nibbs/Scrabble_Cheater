import React, { Component } from 'react'
import { connect } from 'react-redux'

import { highlightWordOnBoard, playWordAndResetRackAndSuggestedWords } from '../../_actions/rackWordlist'

import WordList from './WordList'
class WordListContainer extends Component {
  render() {
    return(
      <WordList 
        suggestedWords={ this.props.suggestedWords }

        handlePlayWord={ this.props.handlePlayWord }  // need to do 
        handleHighlightWordOnHover={ this.props.handleHighlightWordOnHover } // doing
      />
    )
  } 
}

const mapStateToProps = (state, ownProps) => {
  return { 
    suggestedWords: state.websockets.present.suggestedWords
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleHighlightWordOnHover:(wordCoordinates) => {
      dispatch(highlightWordOnBoard(wordCoordinates))
    },
    handlePlayWord:(wordInfo) => {
      dispatch(playWordAndResetRackAndSuggestedWords(wordInfo))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordListContainer)