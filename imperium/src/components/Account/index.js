import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import './index.css';

const INITIAL_STATE = {
	username: '',
	email: '',
	bio: '',
	passwordOne: '',
	passwordTwo: '',
	minor: '',
	major: '',
	resume: '',
	jobType: '',
	photo: '',
	wage: '',
	northeast: '',
	west: '',
	south: '',
	midwest: '',
	start: '',
	end: '',
	isHidden: '',
	emailNotifcation: '',
	desktop: '',
	persona: '',
	company: '',
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
					photoFile: res.photo,
					wage: res.wage,
					jobType: res.jobType,
					northeast: res.northeast,
					west: res.west,
					south: res.south,
					midwest: res.midwest,
					start: res.start,
					end: res.end,
					isHidden: res.isHidden,
					emailNotifcation: res.emailNotifcation,
					desktop: res.desktop,
					persona: res.persona,
					company: res.company,

				});
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	onChange = event => {
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		this.setState({ [event.target.name]: value });

		if (event.target.name === "resume") {
			this.setState({
				resumeFile: event.target.files[0]
			});
		}

		if (event.target.name === "photo") {
			var f = event.target.files[0];
			var r = new FileReader();
			r.onloadend = ()=> {
				this.setState({
					photoFile: r.result
				});
			}
			r.readAsDataURL(f);
		}
	};

	onSubmit = event => {
		const { username, email, bio, passwordOne, passwordTwo, minor, major, photoFile,
			resumeFile, wage, jobType, midwest, northeast, emailNotifcation, desktop,
			west, south, start, end, isHidden, company } = this.state;
		const data = new FormData();
		data.append('file', resumeFile);

		fetch('http://localhost:3000/api/user/ch-resume/' + email, {
			method: 'POST',
			body: data,
		})

		fetch("http://localhost:3000/api/user/ch-settings", {
			//can you send everything like this for employers
			body: JSON.stringify({
				username: username,
				email: email,
				password: passwordOne,
				passwordConfirm: passwordTwo,
				jobType: jobType,
				bio: bio,
				minor: minor,
				major: major,
				photo: photoFile,
				wage: wage,
				northeast: northeast,
				west: west,
				south: south,
				midwest: midwest,
				start: start,
				end: end,
				isHidden: isHidden,
				emailNotifcation: emailNotifcation,
				desktop: desktop,
				company: company,
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
				console.log("setting:" + res)
				this.setState({
					username: res.user.username,
					email: res.user.email,
					bio: res.user.bio,
					minor: res.user.minor,
					major: res.user.major,
					photoFile: res.user.photo,
					wage: res.user.wage,
					northeast: res.user.northeast,
					west: res.user.west,
					south: res.user.south,
					midwest: res.user.midwest,
					start: res.user.start,
					jobType: res.user.jobType,
					end: res.user.end,
					isHidden: res.user.isHidden,
					desktop: res.user.desktop,
					emailNotifcation: res.user.emailNotifcation,
					company: res.user.company,
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
			jobType,
			bio,
			minor,
			major,
			resume,
			photo,
			photoFile,
			wage,
			northeast,
			west,
			south,
			midwest,
			start,
			end,
			isHidden,
			emailNotifcation,
			persona,
			desktop,
			company,
			error,
		} = this.state;
		console.log("render:" + jobType)
//TODO update this
		const isInvalid =
			passwordOne !== passwordTwo ||
			email === '' ||
			username === '';
			console.log(this.state.persona);
if (this.state.persona == "student"){
		return (
			<div>
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
			<p>Upload your resume as a .pdf</p>
			<br/>
			<input
			type="file"
			value={resume}
			name="resume"
			id="resume"
			onChange={this.onChange}
			placeholder="resume" />
			<div>
			<a href={"http://localhost:3000/resumes/"+email+".pdf"} target="_blank" rel="noopener noreferrer">View your current resume</a>
			</div>
			<br/>
			<p>Please upload a photo of yourself as a .png</p>
			<br/>
			<input
			type="file"
			value={ photo }
			name="photo"
			id="photo"
			onChange={this.onChange}/>
			<a href={ photoFile } target="_blank" rel="noopener noreferrer"><img alt="profile" id="photoData" src={ photoFile }/></a>
			<br/>

			<select name="jobType" id="jobType" value={jobType} onChange={this.onChange}>
			<option value="" disabled selected hidden>What type of job are you posting?</option>
			<option value="fullTime">Full Time</option>
			<option value="parttime">Part Time</option>
			<option value="internship">Internship</option>
			<option value="coop">Co-op</option>
			</select>
			<br/>
			<input name="wage" value={wage} onChange={this.onChange} type="number" step=".1" placeholder="Salary of Job"/>
			<br/>
			<p>Please select what reigons you would be interested in working on</p>
			<br/>
			<input name="northeast" checked={northeast} onChange={this.onChange} type="checkbox"/>
			<p>Northeast</p>
			<br/>
			<input name="west" checked={west} onChange={this.onChange} type="checkbox"/>
			<p>West</p>
			<br/>
			<input name="south" checked={south} onChange={this.onChange} type="checkbox"/>
			<p>South</p>
			<br/>
			<input name="midwest" checked={midwest} onChange={this.onChange} type="checkbox"/>
			<p>Midwest</p>
			<br/>

			<p2>Please enter which days you will be able start and end</p2>
			<br/>
			<input name="start" value={start} onChange={this.onChange} type="date"/>
			<input name="end" value={end} onChange={this.onChange} type="date"/>
			<br/>
			<input name="isHidden" checked={isHidden} onChange={this.onChange} type="checkbox"/>
			<p>Hide My Account</p>
			<br/>
			<input name="emailNotifcation" checked={emailNotifcation} onChange={this.onChange} type="checkbox"/>
			<p>Email Notifications</p>
			<br/>
			<input name="desktop" checked={desktop} onChange={this.onChange} type="checkbox"/>
			<p>Desktop Notifications</p>
			<br/>
			<br/>
			<br/>
			<button type="submit" disabled={isInvalid}>
			Save Preferences
			</button>

			{error && <p>{error.message}</p>}
			</form>
			<br/>
			<button type="button" onClick={this.deleteAccount}>
			Delete Account
			</button>
			</div>
		);
	} else if (this.state.persona === "employer"){
		return (
			<div>
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
			name="company"
			value={company}
			onChange={this.onChange}
			type="text"
			placeholder="Company"
			/>
			<br/>
			<p>Please upload a photo of yourself as a .png</p>
			<br/>
			<input
			type="file"
			value={ photo }
			name="photo"
			id="photo"
			onChange={this.onChange}/>
			<a href={ photoFile } target="_blank" rel="noopener noreferrer"><img alt="profile" id="photoData" src={ photoFile }/></a>
			<br/>
			<br/>
			<input name="isHidden" checked={isHidden} onChange={this.onChange} type="checkbox"/>
			<p>Hide My Account</p>
			<br/>
			<input name="emailNotifcation" checked={emailNotifcation} onChange={this.onChange} type="checkbox"/>
			<p>Email Notifications</p>
			<br/>
			<input name="desktop" checked={desktop} onChange={this.onChange} type="checkbox"/>
			<p>Desktop Notifications</p>
			<br/>
			<br/>
			<br/>
			<button type="submit" disabled={isInvalid}>
			Save Preferences
			</button>

			{error && <p>{error.message}</p>}
			</form>
			<br/>
			<button type="button" onClick={this.deleteAccount}>
			Delete Account
			</button>
			</div>
			);
	}
	else {
		//add loading symbol
		return (
		<div>
		</div>
	);
	}
	}
}

const AccountPage = compose(
	withRouter,
	withFirebase,
)(AccountPreferences)

export default AccountPage;
