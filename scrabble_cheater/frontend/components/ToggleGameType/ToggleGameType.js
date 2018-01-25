import React, { Component } from 'react'
import { Label, Radio } from 'semantic-ui-react'

import { WORDS_WITH_FRIENDS, SCRABBLE } from '../../constants/board'
import { toggleGameType } from '../../_actions/tileBoard'

import './ToggleGameType.less'
class ToggleGameType extends Component {
  render() {
    return (
      <div className="section-toggle-game">
        <Label>
          <div className="mt-10px">
            <Radio
              slider
              onMouseDown={ this.props.toggleGameType }
            />
          </div>
          <div className="mt-10px">
            <Label.Detail>
              { this.props.gameType === WORDS_WITH_FRIENDS ? 'Words With Friends' : 'Scrabble' }
            </Label.Detail>
          </div>
        </Label>
      </div>
    )
  }
}

export default ToggleGameType