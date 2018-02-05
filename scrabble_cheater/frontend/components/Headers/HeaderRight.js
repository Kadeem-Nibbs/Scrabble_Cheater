import './HeaderRight.less'

import React, { Component } from 'react'
import { Label, Icon } from 'semantic-ui-react'

class HeaderRight extends Component {
  render() {  
    return(
      <Label className="header-right"> 
        <Icon name='info' /> Enter <span className="big-underscore">_</span> for blank tiles. 
        <div>Blank tiles on the board will be above a <span className="big-underscore">_</span>.</div>
      </Label>
    )
  } 
}

export default HeaderRight

