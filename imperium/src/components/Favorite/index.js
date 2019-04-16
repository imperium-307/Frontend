import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Loader, Heading, Columns, Button } from 'react-bulma-components';

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
					favorites: res.favoritesObject,
					isLoading: false,
				});
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	removeChild = (email) => {
		var favorites = this.state.favorites
		favorites = favorites.filter(e => e.email !== email)
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
			<Columns className="is-multiline is-centered">
			<Columns.Column size={8}>
			<div className="custom-card" >
			<div className="custom-card__heading-gradient">
			<Heading className="text-center custom-card__heading-text" size={1}>Your Favorites</Heading>
			</div>
			<br/>
			<div>
			{(() => {
				if (this.state.isLoading) {
					return (
						<span>
						<br/>
						<Loader className="auto-margin"
						style={{
							width: 100,
								height: 100,
								border: '4px solid',
								borderTopColor: 'transparent',
								borderRightColor: 'transparent',
						}}
						/>
						<br/>
						</span>
					);
				} else {
					if (this.state.favorites && this.state.favorites.length > 0) {
						return this.state.favorites.map((d, i) => {
							var bgcolor = "#fff";
							if (i%2 !== 0) {
								bgcolor = "#f5f5f5";
							}
							return (
								<div className="flex" style={{padding: 16, "justify-content": "space-between", "background-color": bgcolor}}>
								<div style={{display: "inherit"}}>
								<img style={{width: 50, height: 50, "border-radius": "100%"}} src={d.photo}/>
								<span className="flex" style={{"align-items": "center", "padding-left": 10}}>{d.name}</span>
								</div>
								<div className="buttons is-right">
								<Button onClick={() => {this.unfavorite(d.email)}} className="is-info">Unfavorite</Button>
								</div>
								</div>
							)
						})
					} else {
						return (
							<div className="has-text-centered">
							<br/>
							<br/>
							<Heading className="text-center" size={3}>You don't have any favorites!</Heading>
							<Button className="is-info" to={"/home"} renderAs={Link}>Find some‽</Button>
							<br/>
							<br/>
							</div>
						)
					}
				}
			})()}
			</div>
			<br/>
			</div>
			</Columns.Column>
			</Columns>
		)
	}
}

export default compose(
	withRouter,
)(FavoritePage);
