import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import { times } from 'lodash'

import TileContainer from './Tile/TileContainer'
import { TOTAL_TILES, NUMBER_OF_ROWS, NUMBER_OF_COLS} from '../../constants/board'

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