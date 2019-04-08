import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';


var INITIAL_STATE = {
	error: null,
};

class ChatPage extends Component{
  constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}
  render() {
    return (
      <div>
        <h1>Chat</h1>
      </div>
    )
  }
}

export default compose(
  withRouter,
)(ChatPage);
