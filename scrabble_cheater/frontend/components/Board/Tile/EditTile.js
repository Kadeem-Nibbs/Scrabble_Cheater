import React, { Component } from 'react'
import { Table, Form, Input, Button } from 'semantic-ui-react'
import classNames from 'classnames'

import { scores } from  '../../../constants/board'

class EditTile extends Component {
  render() {

    return (
      <Table.Cell>
        <form className="ui form" onSubmit={ this.handleSubmitTile }>
          <Input 
            onKeyDown={ this.handleArrowPress }
            value={ this.state.newTileValue } 
            onChange={ this.updateStateWithTileValue } 
            ref={ (ref) => { this.inputRef = ref }}
            onFocus={ this.handleFocus }
          />
          { this.props.moveDirection ? // todo: move this to function its huge
            // TODO: figure out how to get patthern="XX" to trigger from right / down arrorws
              (
                <Button 
                  type="button"
                  className={ classNames("btn-tile-submit", this.props.moveDirection === 'down' ? 'move-down' : null) } 
                  onClick={ this.handleSubmitTile }
                > 
                  <i className="fas fa-plus"></i> 
                </Button>
              ) :
              (
                <span>
                  <Button 
                    type="button"
                    className="btn-tile-submit right-arrow"
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
              )
          }
        </form>
      </Table.Cell>
    )
  } 
}

export default EditTile