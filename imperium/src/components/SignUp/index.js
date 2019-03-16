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
  <style>{'body { background-color: #878491; }'}</style>
    <h1>Sign Up</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  persona: '',
  bio: '',
  major: '',
  university: '',
  criteria: '',
  company: '',
  error: null

};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onSubmit = event => {
    const { username, email, passwordOne, passwordTwo, persona, university, major, bio, company, criteria } = this.state;
    fetch("http://localhost:3000/api/user/signup", {
  			body: JSON.stringify({
          username: username,
  				email: email,
  				password: passwordOne,
          passwordConfirm: passwordTwo,
          persona: persona,
          bio: bio,
          university: university,
          major: major,
          company: company,
          criteria: criteria

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
            if (persona == "student"){
              this.props.history.push(ROUTES.STUDENT_SIGN_UP);

            }
            else if (persona == "employer") {
              this.props.history.push(ROUTES.EMPLOYER_SIGN_UP);
            }
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
    this.setState({value: event.target.value});
    //this.setState({ [event.target.name]: event.target.value });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      persona,
      bio,
      university,
      major,
      company,
      criteria,
      error
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      persona === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.handleInputChange}
          type="text"
          placeholder="Full Name"
        />
        <br/>
        <input
          name="email"
          value={email}
          onChange={this.handleInputChange}
          type="text"
          placeholder="Email Address"
        />
        <br/>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.handleInputChange}
          type="password"
          placeholder="Password"
        />
        <br/>
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.handleInputChange}
          type="password"
          placeholder="Confirm Password"
        />
        <br/>
        <select name="persona" id="persona" value={this.state.value} onChange={this.onChange}>
          <option value="" disabled selected hidden>Who are you?</option>
          <option value="student">Student</option>
          <option value="employer">Employer</option>
        </select>
        <br/>
        <br/>
        <div>
        {(() => {
        switch (this.state.value) {
          case "student":   return [
            <input name="University" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="University"/>,
            <br/>,
            <input name="Major" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Major"/>,
            <br/>,
            <input name="Bio" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Bio"/>
          ]

          case "employer": return [
            <input name="Company" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Company"/>,
            <br/>,
            <input name="Criteria" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Criteria"/>
          ]
                  }
      })()}

        </div>
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
