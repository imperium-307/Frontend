import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';


var INITIAL_STATE = {
	history: "",
	isLoading: true,
	error: null,
};

class FavoritePage extends Component{
  constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };

		fetch("http://localhost:3000/api/user", {
			body: JSON.stringify({
				token: localStorage.getItem('token')
			}),
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'content-type': 'application/json'
			},
			mode: 'cors',
			method: 'POST'
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				this.setState({
					history: res.history,
					isLoading: false,
				});
			})
			.catch(error => {
				this.setState({ error });
			});
	}
  render() {
    return (
      <div>
			<h1>My Favorites</h1>
			{(() => {
				if (this.state.isLoading) {
					return (
						<div>
						<p>Loading...</p>
						</div>
					);
				} else {
					if (this.state.history) {
						return this.state.history.map((d, i) => {
							if (this.state.history[i].action === "favorite"){
							return (
								<p>You {this.state.history[i].action}d {this.state.history[i].data} on {new Date(this.state.history[i].date).toLocaleDateString("en-US")} at {new Date(this.state.history[i].date).toLocaleTimeString("en-US")}</p>
							)
						}
						})
					} else {
						return (
							<h1>You have no history</h1>
						)
					}
				}
			})()}
      </div>
    )
  }
}

export default compose(
  withRouter,
)(FavoritePage);
