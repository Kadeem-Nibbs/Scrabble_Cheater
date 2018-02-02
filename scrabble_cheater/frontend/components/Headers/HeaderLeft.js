import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

class HeaderLeft extends Component {
  render() {  
    return(
      <Header as='h3'>
        Get answers for Words with Friends or Scrabble!
        <Header.Subheader>
           <h4>Click on a tile below, select a direction, and enter a word.</h4>
        </Header.Subheader>
      </Header>
    )
  } 
}

export default HeaderLeft