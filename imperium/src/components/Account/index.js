import React, { Component } from 'react';
import DeleteAccountButton from '../DeleteAccount';

const Account = () => (
	<div>
	<h1>Account</h1>

	<AccountPreferences />
	<br/>
	<DeleteAccountButton />
	</div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class AccountPreferences extends Component {
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
					username: res.username,
					email: res.email,
					bio: res.bio
				});
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	onSubmit = event => {
		const { username, email, bio, passwordOne, passwordTwo } = this.state;

		fetch("http://localhost:3000/api/user/ch-settings", {
			body: JSON.stringify({
				username: username,
				email: email,
				password: passwordOne,
				passwordConfirm: passwordTwo,
				bio: bio,
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
			.catch(error => {
				this.setState({ error });
			});

		event.preventDefault();
	}

	render() {
		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			bio,
			error,
		} = this.state;

		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === '' ||
			email === '' ||
			username === '' ||
			bio === '';

		return (
			<form onSubmit={this.onSubmit}>
			<input
			name="username"
			value={username}
			onChange={this.onChange}
			type="text"
			placeholder="Full Name"
			/>
			<br/>
			<input
			name="email"
			value={email}
			onChange={this.onChange}
			type="text"
			placeholder="Email Address"
			/>
			<br/>
			<input
			name="passwordOne"
			value={passwordOne}
			onChange={this.onChange}
			type="password"
			placeholder="Password"
			/>
			<br/>
			<input
			name="passwordTwo"
			value={passwordTwo}
			onChange={this.onChange}
			type="password"
			placeholder="Confirm Password"
			/>
			<br/>
			<input
			name="bio"
			value={bio}
			onChange={this.onChange}
			type="bio"
			placeholder="Bio"
			/>

			<br/>
			<button type="button" type="submit">
			save preferences
			</button>

			{error && <p>{error.message}</p>}
			</form>
		);
	}
}

export default Account;
