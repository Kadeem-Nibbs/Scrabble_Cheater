import './Rack.less'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Input, Button, Loader } from 'semantic-ui-react'

class Rack extends Component {
  handleRackChange = (e, target) => {
    const letters = target.value || ''

    // Only alow 2 underscores
    // TODO: could probably do this more elegantly, google stuff when you're not on plane
    let underscoreCount = 0
    for(let i = 0; i < letters.length; i++) {
      if(letters[i] === '_'){ 
        underscoreCount++ 
        if(underscoreCount === 3) {
          return
        }
      }
    }

    // Don't allow weird chars
    if(/^[A-Za-z_]+$|^$/.test(letters) && letters.length <= 7) { 
      this.props.handleUpdateRack(letters.toUpperCase())
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.submitRack()
  }

  render() {
    return(
      <form onSubmit={ this.handleSubmit }>
        <Grid>
          <Grid.Column width={ 8 }>
            <Input 
              placeholder="Enter your letters..."
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
              onClick={ this.handleSubmit }
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