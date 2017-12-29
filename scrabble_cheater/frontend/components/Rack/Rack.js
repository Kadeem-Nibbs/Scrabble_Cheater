import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Input, Button } from 'semantic-ui-react'

class Rack extends Component {
  handleRackChange = (e, target) => {
    const rack = target.value || ''

    if(/^[A-Za-z_]+$|^$/.test(rack) && rack.length <= 7) { 
      // Don't allow weird chars
      this.props.handleUpdateRack(rack.toUpperCase())
    }
  }

  render() {
    return(
      <form onSubmit={ this.props.handleSendTableData }>
        <Grid>
          <Grid.Column width={ 8 }>
            <Input 
              placeholder="Enter your rack..."
              className="rack"
              value={ this.props.rack }
              onChange={ (e, target) => this.handleRackChange(e, target) } 
            />
          </Grid.Column>
          <Grid.Column width={ 8 }>
            <Button 
              className="btn-get-word"
              type="submit"
              disabled={ this.props.loading }
            >
              { this.props.loading ? (<Loader size='tiny' active inline />) : 'Get Words' }
            </Button>
          </Grid.Column>
        </Grid>
      </form>
    )
  } 
}

export default Rack