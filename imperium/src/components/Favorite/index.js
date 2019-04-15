import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Heading } from 'react-bulma-components';

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
					favorites: res.favorites,
					isLoading: false,
				});
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	removeChild = (email) => {
		var favorites = this.state.favorites
		favorites = favorites.filter(e => e !== email)
		this.setState({ favorites });
	}

	unfavorite = (email) => {
		fetch("http://localhost:3000/api/user/unfavorite", {
			body: JSON.stringify({
				token: localStorage.getItem('token'),
				likee: email
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
				this.removeChild(email);
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	render() {
		return (
			<div>
			<Heading className="text-center" size={1}>Your Favorites</Heading>
			{(() => {
				if (this.state.isLoading) {
					return (
						<div>
						<p>Loading...</p>
						</div>
					);
				} else {
					if (this.state.favorites && this.state.favorites.length > 0) {
						return this.state.favorites.map((d, i) => {
							return (
								<li className="user_details">
								<p>{d}</p>
								<div className="user_contact">
								<button onClick={() => {this.unfavorite(d)}}>Unfavorite</button>
								</div>
								</li>
							)
						})
					} else {
						return (
							<h1>You have no favorites</h1>
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
