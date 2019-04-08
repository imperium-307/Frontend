import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';


var INITIAL_STATE = {
	error: null,
};

class FavoritePage extends Component{
  constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}
  render() {
    return (
      <div>
        <h1>My Favorites</h1>
      </div>
    )
  }
}

export default compose(
  withRouter,
)(FavoritePage);
