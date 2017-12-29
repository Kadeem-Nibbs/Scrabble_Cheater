import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

class HeaderLeft extends Component {
  render() {  
    return(
      <Header as='h2'>
        Solutions for board games!
        <Header.Subheader>
          You can use this to generate answers for Words with friends or Scrabble!
        </Header.Subheader>
      </Header>
    )
  } 
}

export default HeaderLeft