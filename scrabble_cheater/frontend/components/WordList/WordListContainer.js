import React, { Component } from 'react'
import { Grid, Input, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'

import WordList from './WordList'
class WordListContainer extends Component {
  render() {  
    return(
      <WordList 
        words={ this.props.suggestedWords } 
        addWordToTable={ this.addWordToTable }
        wordHoveredKey={ this.props.wordHoveredKey }
        handleHighlightWordOnHover={ this.handleHighlightWordOnHover }
      />
    )
  } 
}

// const mapStateToProps = (state, ownProps) => {
//   return { 
//     suggestedWords: state.board.suggestedWords,
//     wordHoveredKey: state.board.wordHoveredKey
//   }
// }

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     // dispatchToggleGameType: () => {
//     //   dispatch(toggleGameType())
//     // }
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(WordListContainer)
export default WordListContainer