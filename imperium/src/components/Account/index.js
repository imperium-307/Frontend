import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import './index.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Notification, Content, Image, Heading, Button, Card, Loader, Media } from 'react-bulma-components';

const INITIAL_STATE = {
	username: '',
	email: '',
	bio: '',
	passwordOne: '',
	passwordTwo: '',
	minor: '',
	major: '',
	university: '',
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
	emailNotifications: '',
	desktopNotifications: '',
	persona: '',
	company: '',
	favoriteNotifications: '',
	photoFile: null,
	resumeFile: null,
	savedPrefPopup: false,
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
					university: res.university,
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
					emailNotifications: res.emailNotifications,
					desktopNotifications: res.desktopNotifications,
					persona: res.persona,
					company: res.company,
					favoriteNotifications: res.favoriteNotifications,

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
		const { username, email, bio, passwordOne, passwordTwo, minor, major, university, photoFile,
			resumeFile, wage, jobType, midwest, northeast, emailNotifications, desktopNotifications, favoriteNotifications,
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
				university: university,
				photo: photoFile,
				wage: wage,
				northeast: northeast,
				west: west,
				south: south,
				midwest: midwest,
				start: start,
				end: end,
				isHidden: isHidden,
				emailNotifications: emailNotifications,
				desktopNotifications: desktopNotifications,
				company: company,
				favoriteNotifications: favoriteNotifications,
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
					university: res.user.university,
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
					desktopNotifications: res.user.desktopNotifications,
					emailNotifications: res.user.emailNotifications,
					company: res.user.company,
					favoriteNotifications: res.user.favoriteNotifications,
					savedPrefPopup: true
				});

				setTimeout(() => {
					this.setState({
						savedPrefPopup: false
					});
				}, 5000)
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
			university,
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
			emailNotifications,
			persona,
			desktopNotifications,
			company,
			favoriteNotifications,
			error,
			savedPrefPopup,
		} = this.state;

		var isInvalid = false;
		if (((passwordOne !== '' || passwordTwo !== '') && passwordOne !== passwordTwo) || username === '' || bio === '') {
			isInvalid = true;
		}
		if (this.state.persona == "student") {
			if (start === '' || end === '' || university === '' || jobType === '' || (!south && !midwest && !northeast && !west) || wage === '' || major === '') {
				isInvalid = true;
			}
		} else {
			if (company === '') {
				isInvalid = true;
			}
		}

		if (this.state.persona == "student"){
			return (
				<div>
				<h1>Account</h1>
				{(() => {
					if (savedPrefPopup) {
						return (
							<Notification color="success">
							Your settings have been saved
							<Button remove onClick={() => {this.setState({savedPrefPopup: false})}}/>	
							</Notification>
						)
					}
				})()}
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
				disabled={true}
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
				name="university"
				value={university}
				onChange={this.onChange}
				type="text"
				placeholder="University"
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
				<div>
				<a href={"http://localhost:3000/resumes/"+email+".pdf"} target="_blank" rel="noopener noreferrer">View your current resume</a>
				</div>
				<input
				type="file"
				value={resume}
				name="resume"
				id="resume"
				onChange={this.onChange}
				placeholder="resume" />
				<br/>
				<a href={ photoFile } target="_blank" rel="noopener noreferrer"><img alt="profile" id="photoData" src={ photoFile }/></a>
				<input
				type="file"
				value={ photo }
				name="photo"
				id="photo"
				onChange={this.onChange}/>

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
				<input name="emailNotifications" checked={emailNotifications} onChange={this.onChange} type="checkbox"/>
				<p>Email Notifications</p>
				<br/>
				<input name="desktopNotifications" checked={desktopNotifications} onChange={this.onChange} type="checkbox"/>
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
				{(() => {
					if (savedPrefPopup) {
						return (
							<Notification color="success">
							Your settings have been saved
							<Button remove onClick={() => {this.setState({savedPrefPopup: false})}}/>	
							</Notification>
						)
					}
				})()}
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
				disabled={true}
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
				<input
				name="bio"
				value={bio}
				onChange={this.onChange}
				type="bio"
				placeholder="Bio"
				/>
				<br/>
				<a href={ photoFile } target="_blank" rel="noopener noreferrer"><img alt="profile" id="photoData" src={ photoFile }/></a>
				<input
				type="file"
				value={ photo }
				name="photo"
				id="photo"
				onChange={this.onChange}/>
				<br/>
				<br/>
				<input name="isHidden" checked={isHidden} onChange={this.onChange} type="checkbox"/>
				<p>Hide My Account</p>
				<br/>
				<input name="emailNotifications" checked={emailNotifications} onChange={this.onChange} type="checkbox"/>
				<p>Email Notifications</p>
				<br/>
				<input name="desktopNotifications" checked={desktopNotifications} onChange={this.onChange} type="checkbox"/>
				<p>Desktop Notifications</p>
				<br/>
				<input name="favoriteNotifications" checked={favoriteNotifications} onChange={this.onChange} type="checkbox"/>
				<p>Favorite Notifiactions</p>
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
)(AccountPreferences)

export default AccountPage;
