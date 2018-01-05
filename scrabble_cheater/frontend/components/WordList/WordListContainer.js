import React, { Component } from 'react'
import { Grid, Input, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'

import { highlightWordOnBoard, playWordAndResetRack } from '../../_actions/rackWordlist'

import WordList from './WordList'
class WordListContainer extends Component {
  render() {
    return(
      <WordList 
        words={ this.props.suggestedWords }
        hideSuggestedWords={ this.props.hideSuggestedWords }

        handlePlayWord={ this.props.handlePlayWord }  // need to do 
        handleHighlightWordOnHover={ this.props.handleHighlightWordOnHover } // doing
      />
    )
  } 
}

const mapStateToProps = (state, ownProps) => {
  return { 
    suggestedWords: state.websockets.suggestedWords,
    hideSuggestedWords: state.wordList.present.wordAdded
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleHighlightWordOnHover:(wordCoordinates) => {
      dispatch(highlightWordOnBoard(wordCoordinates))
    },
    handlePlayWord:(wordInfo) => {
      dispatch(playWordAndResetRack(wordInfo))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordListContainer)