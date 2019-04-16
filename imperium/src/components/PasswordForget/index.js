import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Notification, Heading, Columns, Button } from 'react-bulma-components';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
	<div>
	<PasswordForgetForm />
	</div>
);

const INITIAL_STATE = {
	email: '',
	error: null,
};

class PasswordForgetFormBase extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		const { email } = this.state;
		fetch("http://localhost:3000/api/user/reset", {
			body: JSON.stringify({
				email: email
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
				if (res.err) {
					console.log("reset failed");
					this.setState({ error: res.err });
				} else {
					console.log("reset successful");
					this.props.history.push(ROUTES.SIGN_IN);
				}
			})
			.catch(error => {
				this.setState({ error });
			});

		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, error } = this.state;

		const isInvalid = email === '';

		return (
			<Columns className="is-multiline is-centered">
			<Columns.Column size={6}>
			<div className="custom-card" >
			<div className="custom-card__heading-gradient">
			<Heading className="text-center custom-card__heading-text" size={3}>Reset Password</Heading>
			</div>
			<br/>
			<div>
			<form onSubmit={this.onSubmit} style={{padding:16}}>
			<div className="field">
			<label className="label">Email</label>
			<div className="control">
			<input
			name="email"
			className="input"
			value={this.state.email}
			onChange={this.onChange}
			type="email"
			placeholder="Email Address"
			/>
			</div>
			</div>
			<Button className="is-fullwidth" disabled={isInvalid} type="submit">
			Reset My Password
			</Button>
			</form>
			</div>
			</div>
			{(() => {
				if (error && error != '' && typeof(error) === "string") {
					setTimeout(() => {
						this.setState({error: null})
					}, 3000);

					return (
						<Notification color="danger" style={{margin: 16}}>
						{error}
						<Button remove onClick={() => {this.setState({error: null})}}/>	
						</Notification>
					)
				}
			})()}
			</Columns.Column>
			</Columns>
		);
	}
}

const PasswordForgetForm = compose(
	withRouter,
)(PasswordForgetFormBase);

export default PasswordForgetPage;

export { PasswordForgetForm };
