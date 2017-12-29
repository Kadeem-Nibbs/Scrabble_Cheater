import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Input, Button } from 'semantic-ui-react'

class Rack extends Component {
  render() {  
    return(
      <form onSubmit={ this.handleSendTableData }>
        <Grid>
          <Grid.Column width={ 8 }>
            <Input 
              placeholder="Enter your rack..."
              className="rack"
              value={ this.props.rack } 
              onChange={ this.handleRackChange } 
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