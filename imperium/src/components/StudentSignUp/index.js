import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

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

const StudentSignUp = () => (
  <div style={styles}>
  <style>{'body { background-color: #878491; }'}</style>
    <h1>Student Sign Up</h1>
    <StudentSignUpForm />
  </div>
);

const INITIAL_STATE = {
  bio: '',
  internship: false,
  coop: false,
  fullTime: false,
  error: null,

};

class StudentSignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { bio, internship, coop, fullTime } = this.state;
    console.log(internship);
    fetch("http://localhost:3000/api/user/studentsignup", {
  			body: JSON.stringify({
          bio: bio,
          internship: internship,
          coop: coop,
          fullTime: fullTime
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
      internship,
      coop,
      fullTime,
      error,
    } = this.state;

    const isInvalid =
      bio === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="bio"
          value={bio}
          onChange={this.onChange}
          type="text"
          placeholder="Bio"
        />
        <br/>
        <input type="checkbox" name="internship" value={internship} onChange={this.onChange}/>
        Internship
        <br/>
        <input type="checkbox" name="coop" value={coop} onChange={this.onChange}/>
        Co-op
        <br/>
        <input type="checkbox" name="fullTime" value={fullTime} onChange={this.onChange}/>
        Full Time
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
const StudentSignUpForm = compose(
  withRouter,
  withFirebase,
)(StudentSignUpFormBase);

export default StudentSignUp;