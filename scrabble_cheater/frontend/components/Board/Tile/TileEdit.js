import React, { Component } from 'react'
import { Table, Input, Button } from 'semantic-ui-react'
import classNames from 'classnames'

import './TileEdit.less'

class EditTile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '' // This gets placed in redux state when the user saved it
    }
  }

  componentDidMount() {
    if(this.inputRef) {
      this.inputRef.focus()
    }
  }

  setTileValue = (event, data) => {
    const { value } = data

    if(value.length > 1 ) {
      return 
    } 

    if(/^[A-Za-z_]+$|^$/.test(value)) {
      this.setState({ value: value.toUpperCase() })
    }
  }

  handleSubmitTile = (e) => {
    e.preventDefault()
    this.props.changeTileValue(this.state.value)
  }

  handleArrowPress = (e) => {
    console.log("arrow press", e);
  }

  render() {
    return (
      <Table.Cell>
        <form className="ui form" onSubmit={ this.handleSubmitTile }>
          <Input 
            value={ this.state.value } 
            onChange={ this.setTileValue } 
            ref={ (ref) => { this.inputRef = ref }}
            onKeyDown={ this.handleArrowPress }
          />
          <span>
            <Button 
              type="button"
              className={ classNames("btn-tile-submit right-arrow", { "muted" : true }) }
              onClick={ this.handleMoveRight }
            > 
              <i className="fas fa-arrow-right"></i> 
            </Button>
            <Button 
              type="button"
              className="btn-tile-submit down-arrow" 
              onClick={ this.handleMoveDown }
            >  
                <i className="fas fa-arrow-down"></i>  
              </Button>
          </span>
        </form>
      </Table.Cell>
    )
  } 
}

export default EditTile