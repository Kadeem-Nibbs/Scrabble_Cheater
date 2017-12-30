import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { times } from 'lodash'

import TileContainer from './Tile/TileContainer'
import { TOTAL_TILES, NUMBER_OF_ROWS, NUMBER_OF_COLS} from '../../constants/board'


function sup () {
  const board = []
    // These three vars get altered when endRow is true
    let row =[]
    let rowNumber = 0
    let cellNumber = 0

    for(let i = 0; i < TOTAL_TILES; i++) {
      const tileCoordinates = { x: cellNumber, y: rowNumber }
      const endRow = (cellNumber === 14) ? true : false

      const tileIsEditable = (
        this.state.editableTileCoordinates.x === cellNumber
      ) && (
        this.state.editableTileCoordinates.y === rowNumber
      ) ? true : false

      row.push(
        <TileContainer
          key={ i }
          tileIsEditable={ tileIsEditable }
          tileCoordinates={ tileCoordinates }

          handleTileValueChanged={ this.handleTileValueChanged }
          handleMakeTileEditable={ this.handleMakeTileEditable }

          gameType={ this.props.gameType }
          moveDirection={ this.state.moveDirection }
          coordinatesToHighlight={ this.state.coordinatesToHighlight }
          cellChar={ this.state.tableData[rowNumber][cellNumber] }
        />
      )

      cellNumber++

      if(endRow) {
        board.push(
          <Table.Row 
            key={ rowNumber } 
            children={ row } 
          />
        )

        // reset row after its pushed / increment rowNumber to next row / and reset cell we are at
        row = [] 
        rowNumber = rowNumber + 1
        cellNumber = 0
      }
    }

    return board
}

class Board extends Component {
  render() {
    return(
      <Table.Body>
        {
          times(NUMBER_OF_ROWS, (rowNumber) => {
            return(
              <Table.Row key={ rowNumber }>
                { 
                  times(NUMBER_OF_COLS, (colNumber) => {
                    console.log('Board :: tile render');
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
    )
  }
}

export default Board