import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

class HeaderLeft extends Component {
  render() {  
    return(
      <Header as='h2'>
        Get solutions for board games!
        <Header.Subheader>
          Generate answers for Words with friends or Scrabble! 
        </Header.Subheader>
        <Header.Subheader className="mt-10px mb-15px">
          <h5>Click on a tile below, select a direction, and enter a word.</h5>
        </Header.Subheader>
      </Header>
    )
  } 
}

export default HeaderLeft