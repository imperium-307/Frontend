import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter, Route,  } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';


import * as ROUTES from '../../constants/routes';
const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  marginTop: "40px",
  color: "#3D23B0"
};

const buttonStyle = {
	fontSize: 20,
	fontWeight: '400',
	color: "#fff",
	backgroundColor: "#3D23B0",
	paddingHorizontal: 30,
	paddingVertical: 5,
	borderRadius: 30
};

const PasswordForgetPage = () => (
  <div style={styles}>
  <style>{'body { background-color: #282c34; }'}</style>
    <h1>Forgot Password</h1>
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
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <br/>
        <br/>
        <button style={buttonStyle} disabled={isInvalid} type="submit">
          Reset My Password
        </button>

				{error && <p>{error}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

const PasswordForgetForm = compose(
	withRouter,
)(PasswordForgetFormBase);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
