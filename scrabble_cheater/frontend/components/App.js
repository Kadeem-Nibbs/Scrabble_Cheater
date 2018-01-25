import React, { Component } from 'react'
import { Container, Grid } from 'semantic-ui-react'

import HeaderLeft from './Headers/HeaderLeft'
import BoardContainer from './Board/BoardContainer'
import ToggleGameTypeContainer from './ToggleGameType/ToggleGameTypeContainer'

import HeaderRight from './Headers/HeaderRight'
import RackContainer from './Rack/RackContainer'
import WordListContainer from './WordList/WordListContainer'
import UndoRedoClear from './UndoRedoClear/UndoRedoClear'

class App extends Component {
  render() {  
    return (
      <Container className="mt-50px">
        <Grid className="scrabble-container centered">
          <Grid.Column className="fixed-width-left-col">
            
            <HeaderLeft />
            <BoardContainer />

            <ToggleGameTypeContainer />
            <UndoRedoClear />

          </Grid.Column>
        <Grid.Column className="mt-34px fixed-width-right-col">

            <HeaderRight />
            <RackContainer />
            <WordListContainer />

        </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

export default App