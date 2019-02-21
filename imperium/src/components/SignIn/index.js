import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
	<div>
	<h1>Welcome!</h1>
	<SignInForm />
	<PasswordForgetLink />
	<SignUpLink />
	</div>
);

const INITIAL_STATE = {
	email: '',
	password: '',
	error: null,
};

class SignInFormBase extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		const { email, password } = this.state;

		fetch("http://localhost:3000/api/user/login", {
			body: JSON.stringify({
				email: email,
				password: password
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
				this.setState({token: res.token});
				this.props.history.push(ROUTES.HOME);
				localStorage.setItem('token', res.token)
				console.log("logged in")
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
		const { email, password, error } = this.state;

		const isInvalid = password === '' || email === '';

		return (
			<form onSubmit={this.onSubmit}>
			<input
			name="email"
			value={email}
			onChange={this.onChange}
			type="text"
			placeholder="Email Address"
			/>
			<br/>
			<input
			name="password"
			value={password}
			onChange={this.onChange}
			type="password"
			placeholder="Password"
			/>
			<br/>
			<button disabled={isInvalid} type="submit">
			Sign In
			</button>

			{error && <p>{error.message}</p>}
			</form>
		);
	}
}

const SignInForm = compose(
	withRouter,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
