import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { Notification, Heading, Columns, Button } from 'react-bulma-components';

const SignInPage = () => (
	<div>
	<SignInForm />
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
		if (localStorage.getItem('email')) {
			this.state.email = localStorage.getItem('email')
		}
	}

	onSubmit = event => {
		const { email, password } = this.state;
		fetch(ROUTES.BASE_URL + "/api/user/login", {
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
				if (res.token) {
					console.log("logged in with token" + res.token)
					localStorage.setItem('token', res.token)
					localStorage.setItem('persona', res.persona)
					localStorage.setItem('myemail', email)

					if (this.state.rememberEmail === "on") {
						localStorage.setItem('email', email)
						console.log("signed in and logged in with token" + res.token)
					} else {
						localStorage.removeItem('email')
						this.setState({ error: res.err });
					}

					if (res.persona === "student"){
						this.props.history.push(ROUTES.HOME);
					} else {
						this.props.history.push("/company/" + email);
					}
				} else {
					this.setState({ error: res.err });
					console.log("sign in failed")
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
		const { email, password, error } = this.state;

		const isInvalid = password === '' || email === '';

		return (
			<div>
			<Columns className="is-multiline is-centered">
			<Columns.Column size={6}>
			<div className="custom-card">
			<div className="custom-card__heading-gradient">
			<Heading className="text-center custom-card__heading-text" size={3}>Sign in</Heading>
			</div>
			<br/>
			<div>
			<form onSubmit={this.onSubmit} style={{padding: 16}}>
			<div className="field">
			<label className="label">Email</label>
			<div className="control">
			<input
			name="email"
			className="input"
			value={email}
			onChange={this.onChange}
			type="email"
			placeholder="Email Address"
			/>
			</div>
			</div>
			<div className="field">
			<label className="label">Password</label>
			<div className="control">
			<input
			className="input"
			name="password"
			value={password}
			onChange={this.onChange}
			type="password"
			placeholder="Password"
			/>
			</div>
			</div>
			<div className="flex" style={{"justify-content":"space-between"}}>
			<Link to={ROUTES.PASSWORD_FORGET}>
			Forgot password?
			</Link>
			<div>
			<input
			type="checkbox"
			name="rememberEmail"
			checked={this.state.rememberEmail}
			onChange={this.onChange}
			/>
			<span> Remember email?</span>
			</div>
			</div>
			<br/>
			<Button className="is-fullwidth" disabled={isInvalid} type="submit">
			Sign In
			</Button>
			<Button className="is-info is-fullwidth" to={ROUTES.SIGN_UP} renderAs={Link} style={{"margin-top":5}}>
			Sign Up
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
			</div>
		);
	}
}

const SignInForm = compose(
	withRouter,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
