import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

class HeaderLeft extends Component {
  render() {  
    return(
      <Header as='h2'>
        Get answers for Words with Friends!
        <Header.Subheader>
           <h3>Click on a tile below, select a direction, and enter a word.</h3>
        </Header.Subheader>
      </Header>
    )
  } 
}

export default HeaderLeft