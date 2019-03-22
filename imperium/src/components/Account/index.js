import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

var pdf = false;
var jpeg = false;

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

const Account = () => (
		<AccountPreferences />
);

const INITIAL_STATE = {
  username: '',
  email: '',
	bio: '',
  passwordOne: '',
  passwordTwo: '',
  minor: '',
  major: '',
  resume: '',
  photo: '',
  photoFile: null,
  resumeFile: null,
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
					bio: res.bio,
          minor: res.minor,
          major: res.major,
          photoFile: res.photo
				});
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });

		if (event.target.name == "resume") {
			this.setState({
				["resumeFile"]: event.target.files[0]
			});
		}

		if (event.target.name == "photo") {
			var f = event.target.files[0];
			var r = new FileReader();
			r.onloadend = ()=> {
				this.setState({
					["photoFile"]: r.result
				});
			}
			r.readAsDataURL(f);
		}
	};

	onSubmit = event => {
		const { username, email, bio, passwordOne, passwordTwo, minor, major, photoFile, resumeFile } = this.state;

		const data = new FormData();
		data.append('file', resumeFile);

		fetch('http://localhost:3000/api/user/ch-resume/' + email, {
			method: 'POST',
			body: data,
		})

		fetch("http://localhost:3000/api/user/ch-settings", {
			body: JSON.stringify({
				username: username,
				email: email,
				password: passwordOne,
				passwordConfirm: passwordTwo,
				bio: bio,
        minor: minor,
        major: major,
        photo: photoFile,
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
			.then(() => {
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
							bio: res.bio,
              minor: res.minor,
              major: res.major,
              photoFile: res.photo
						});
					})
					.catch(error => {
						this.setState({ error });
					});
			})
			.catch(error => {
				this.setState({ error });
			});

		event.preventDefault();
	}

	deleteAccount = () => {
		fetch("http://localhost:3000/api/user/delete", {
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
				if (res.err) {
					console.log("delete account failed")
					this.setState({ error: res.err });
				} else {
					console.log("delete account successful")
					this.props.history.push(ROUTES.HOME);
					localStorage.removeItem('token')
				}
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	render() {
		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			bio,
      minor,
      major,
			resume,
      photo,
      photoFile,
			error,
		} = this.state;

		const isInvalid =
			passwordOne !== passwordTwo ||
			email === '' ||
			username === '' ||
			bio === '' ||
      minor === '' ||
      major === '';

console.log(photo)

		return (
			<div style={styles}>
			<style>{'body { background-color: #DBDAE1; }'}</style>
			<h1>Account</h1>
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
			<input
			name="major"
			value={major}
			onChange={this.onChange}
			type="text"
			placeholder="Major"
			/>
			<br/>
			<input
			name="minor"
			value={minor}
			onChange={this.onChange}
			type="text"
			placeholder="Minor"
			/>
			<br/>
      <p1>Upload your resume as a .pdf</p1>
      <br/>
      <input
      type="file"
      value={resume}
      name="resume"
      id="resume"
      onChange={this.onChange}
      placeholder="resume" />
			<div>
			<a href={"http://localhost:3000/resumes/"+email+".pdf"} target="_blank">View your current resume</a>
			</div>
      <br/>
      <p1>Please upload a photo of yourself as a .png</p1>
      <br/>
      <input
      type="file"
      value={ photo }
      name="photo"
      id="photo"
      onChange={this.onChange}/>
      <a href={ photoFile } target="_blank"><img src={ photoFile }/></a>
      <br/>

			<br/>
			<button style={buttonStyle} type="button" type="submit" disabled={isInvalid}>
			Save Preferences
			</button>

			{error && <p>{error.message}</p>}
			</form>
			<br/>
			<button style={buttonStyle} type="button" onClick={this.deleteAccount}>
				Delete Account
			</button>
			</div>
		);
	}
}

const AccountPage = compose(
	withRouter,
	withFirebase,
)(AccountPreferences)

export default AccountPage;
