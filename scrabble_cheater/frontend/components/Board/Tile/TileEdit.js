import React, { Component } from 'react'

import { Table, Input, Button } from 'semantic-ui-react'
import classNames from 'classnames'


import './TileEdit.less'

class EditTile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.cellCharacter ? props.cellCharacter : ''
    }
  }

  componentDidMount() {
    if(this.inputRef) {
      this.inputRef.focus()
    }
  }

  componentDidUpdate() {
    if(this.props.direction) {
      this.inputRef.focus()
    }
  }

  highlightOnFocus = (e) => {
    // If the user clicks into a input that already has a value, 
    // highlight it so they dont get 'stuck' 
    // stuck = so they dont have to hit backspace before entering a new leyter
    // (TODO: this doesn't highlight the letter on mobile (at least iOS)
    e.target.select()
  }


  handleKeyDown = (e) => {
    // If the current tile has a value it means the user has 
    // clicked into an older tile to edit it, so don't trigger undo!

    // Bad UX side effect: user has to hit 'enter' to clear the tile if that is their intention.
    // Seems like hitting enter is a natural user motion though so think its fine, 
    //  but maybe TODO: allow backspace to submit clear tile here. Have to rework undo some for that.
    if (e.keyCode === 8 && this.state.value === '') {
      this.props.undoTilePlacement()
    }
  }

  changeTileValue = (e, target = { value: '' }) => {
    const { value } = target
    if(value.length > 1 ) { return } 
    if(value.length === 0 ) {
      this.setState({ value: '' })
    }

    if(/^[A-Za-z_]+$/.test(value)) {
      this.setState({ value: value.toUpperCase() }, () => {
        this.handleSubmitTile()
      })
    }
  }

  handleSubmitTile = (e) => {
    if(e) { e.preventDefault() }
    this.props.handleTileSubmit(this.state.value)
  }

  handleCaptureDirectionArrow = (e) => {
    if (e.keyCode === 39) { 
      this.props.handleSetMoveDirection('right')
    } else if (e.keyCode === 40) {
      this.props.handleSetMoveDirection('down')
    }
  }



  render() {
    return (
      <Table.Cell>
        <form className="ui form" onSubmit={ this.handleSubmitTile }>
          { // Force user to select a direction
            this.props.direction ? (
              <Input
                onFocus={ this.highlightOnFocus }
                value={ this.state.value } 
                onChange={ this.changeTileValue } 
                ref={ (ref) => { this.inputRef = ref }}
                onKeyDown={ this.handleKeyDown }
              />
            ) : (
              <span className="direction-button-wrapper">
                <input 
                  onKeyDown={ this.handleCaptureDirectionArrow }
                  className="capture-arrow-press" 
                  ref={ (ref) => { this.inputRef = ref }}
                />
                <Button 
                  type="button"
                  className="btn-tile-submit right-arrow"
                  onClick={ () => this.props.handleSetMoveDirection('right') }
                > 
                  <i className="fas fa-arrow-right"></i> 
                </Button>
                <Button 
                  type="button"
                  className="btn-tile-submit down-arrow"
                  onClick={ () => this.props.handleSetMoveDirection('down') }
                >  
                    <i className="fas fa-arrow-down"></i>  
                  </Button>
              </span>
            )
          }
        </form>
      </Table.Cell>
    )
  } 
}

export default EditTile