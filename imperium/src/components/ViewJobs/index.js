import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { Loader, Notification, Button, Heading, Columns, Field, Label, Control, Input } from 'react-bulma-components';

//TODO make it so you cant click the create posting button without entering all the fields

var INITIAL_STATE = {

	error: '',
};

class ViewJobsPage extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	render(){
	   return (
       <div>
          <h1>I did it, I activated bites the dustu</h1>
       </div>
     )
		}
}

export default compose(
	withRouter,
)(ViewJobsPage);
