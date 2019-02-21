import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import './Button.css';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  marginTop: "40px",
  color: "#421CE8"
};
const buttonStyle = {
	fontSize: 20,
	fontWeight: '400',
	color: "#fff",
	backgroundColor: "#421CE8",
	paddingHorizontal: 30,
	paddingVertical: 5,
	borderRadius: 30
};

const SignUpPage = () => (
  <div style={styles}>
  <style>{'body { background-color: #282c34; }'}</style>
    <h1>Sign Up As A Student</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  bio: '',
  error: null,

};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, passwordTwo, bio } = this.state;
    var x = 1;
    fetch("http://localhost:3000/api/user/signup", {
  			body: JSON.stringify({
          username: username,
  				email: email,
  				password: passwordOne,
          passwordConfirm: passwordTwo,
          bio: bio
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
          if (res.status != 200) {
					x = 0;
				}
  				return res.json()
  			})
  			.then((res) => {
					if (res.token) {
						this.props.history.push(ROUTES.HOME);
						localStorage.setItem('token', res.token)
						console.log("signed up and logged in with token" + res.token)
					} else if (res.err) {
						console.log("sign up failed")
						this.setState({ error: res.err });
					}
  			})
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

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
        <br/>
        <button style={buttonStyle} disabled={isInvalid} type="submit">
          Sign Up
        </button>

        {error && <p>{error}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
