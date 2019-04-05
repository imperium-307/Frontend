import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import logo from './logo.jpg'
import logo2 from './logo2.jpg'
import logo3 from './logo3.jpg'
import "./logo.css"
import "./logo2.css"
import "./logo3.css"
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import * as ROUTES from '../../constants/routes';

const styles = {
	fontFamily: "arial",
	textAlign: "center",
	marginTop: "40px",
	color: "#421CE8",
};
const buttonText = {
	fontSize: 40,
	fontWeight: '400',
	color: "#fff"
}
const formStyle = {

}
const buttonStyle = {
	fontSize: 20,
	fontWeight: '400',
	color: "#fff",
	backgroundColor: "#421CE8",
	paddingHorizontal: 30,
	paddingVertical: 5,
	borderRadius: 30
}
const SignInPage = () => (
	<div style={styles}>
	<style>{'body { background-color: #DBDAE1; }'}</style>
	<h1>Welcome to Imperium!</h1>
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
		if (localStorage.getItem('email')) {
			this.state.email = localStorage.getItem('email')
		}
	}

	onSubmit = event => {
		const { email, password } = this.state;
		var x = 1;
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
				if (res.token) {
					console.log("logged in with token" + res.token)
					localStorage.setItem('token', res.token)
					localStorage.setItem('persona', res.persona)


					if (this.state.rememberEmail == "on") {
						localStorage.setItem('email', email)
						console.log("signed in and logged in with token" + res.token)
					} else {
						localStorage.removeItem('email')
						this.setState({ error: res.err });
					}
					this.props.history.push(ROUTES.HOME);
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
			<form style={formStyle} onSubmit={this.onSubmit}>
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
			<input
			type="checkbox"
			name="rememberEmail"
			checked={this.state.rememberEmail}
			onChange={this.onChange}
			/>
			<span>Remember email?</span>
			<br/>
			<button style={buttonStyle}  disabled={isInvalid} type="submit">
			Sign In
			</button>

			{error && <p>{error}</p>}
			</form>
		);
	}
}

const SignInForm = compose(
	withRouter,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
