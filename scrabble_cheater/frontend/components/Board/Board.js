import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { times } from 'lodash'

import TileContainer from './Tile/TileContainer'
import { 
  TOTAL_TILES, 
  NUMBER_OF_ROWS, 
  NUMBER_OF_COLS, 
  BTN_UNDO, 
  BTN_REDO, 
  BTN_CLEAR 
} from '../../constants/board'

class Board extends Component {
  constructor(props) {
    super(props)
    this.wrapperRef = null
  }

  // For clicking outside of tile area
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = (e) => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.props.stopEditingTiles()
    }
  }

  render() {
    return(
      <div ref={ (ref) => { this.wrapperRef = ref  } }>
        <Table unstackable celled>
          <Table.Body>
            {
              times(NUMBER_OF_ROWS, (rowNumber) => {
                return(
                  <Table.Row key={ rowNumber }>
                    { 
                      times(NUMBER_OF_COLS, (colNumber) => {
                        return(
                          <TileContainer
                            coordinates={ { y: rowNumber, x: colNumber } }
                            key={ colNumber }
                          />
                        )
                      }) 
                    }
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default Board