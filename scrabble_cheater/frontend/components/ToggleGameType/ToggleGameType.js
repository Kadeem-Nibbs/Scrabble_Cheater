import React, { Component } from 'react'
import { Label, Radio } from 'semantic-ui-react'
import { wordsWithFriends, scrabble } from '../../constants'

import { toggleGameType } from '../../_actions'

class ToggleGameType extends Component {
  render() {
    return (
      <div className="section-toggle-game">
        <Label>
          <div className="mt-10px">
            <Radio
              slider
              onMouseDown={ this.props.dispatchToggleGameType }
            />
          </div>
          <div className="mt-10px">
            <Label.Detail>
              { this.props.gameType === wordsWithFriends ? 'Words With Friends' : 'Scrabble' }
            </Label.Detail>
          </div>
        </Label>
      </div>
    )
  }
}

export default ToggleGameType