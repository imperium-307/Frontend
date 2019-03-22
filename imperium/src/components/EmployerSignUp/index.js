import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const styles = {
  fontFamily: "arial",
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

const EmployerSignUp = () => (
  <div style={styles}>
  <style>{'body { background-color: #DBDAE1; }'}</style>
    <h1>Employer Sign Up</h1>
    <EmployerSignUpForm />
  </div>
);

const INITIAL_STATE = {
  bio: '',
  jobType: '',
  error: null,

};

class EmployerSignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { bio, jobType } = this.state;
    fetch("http://localhost:3000/api/user/employersignup", {
  			body: JSON.stringify({
          bio: bio,
          jobType: jobType
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
      bio,
      jobType,
      error,
    } = this.state;

    const isInvalid =
      bio === '' ||
      jobType === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="bio"
          value={bio}
          onChange={this.onChange}
          type="text"
          placeholder="Description of Job"
        />
        <br/>
        <select name="jobType" value={jobType} onChange={this.onChange}>
          <option value="" disabled selected hidden>What type of job?</option>
          <option value="internship">Internship</option>
          <option value="coop">Co-op</option>
          <option value="fullTime">fullTime</option>
        </select>
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
const EmployerSignUpForm = compose(
  withRouter,
  withFirebase,
)(EmployerSignUpFormBase);

export default EmployerSignUp;
