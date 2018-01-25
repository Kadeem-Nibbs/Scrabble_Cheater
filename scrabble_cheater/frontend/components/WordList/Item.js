import React, { Component } from 'react'
import classNames from 'classnames'
import { Menu, Label } from 'semantic-ui-react'

class Item extends Component {
  constructor(props) {
    super(props) 

    this.state = {
      itemHovered: false
    }
  }

  handleMouseEnter = () => {  
    this.setState({ itemHovered: true })
    this.props.handleItemHover(this.props.itemNumber)
  }

  handleMouseLeave = () => {
    this.setState({ itemHovered: false })
  }

  render() {
    return (
      <Menu.Item
        className={ classNames({ 'active': this.state.itemHovered }) }
        onMouseEnter={ this.handleMouseEnter }
        onMouseLeave={ this.handleMouseLeave }
      >

        {`${ this.props.word } is worth ${this.props.points} points`}
         <Label onClick={ this.props.handleAddWord.bind(this, this.props.itemNumber) }>
            <i 
              className="fa fa-plus-circle" 
              aria-hidden="true"
            ></i>
         </Label>
      </Menu.Item>
    )
  }
}
  
export default Item
