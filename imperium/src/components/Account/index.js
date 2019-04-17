import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import './index.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Columns, Notification, Content, Image, Heading, Button, Card, Loader, Media } from 'react-bulma-components';

const INITIAL_STATE = {
	username: '',
	email: '',
	bio: '',
	passwordOne: '',
	passwordTwo: '',
	minor: '',
	major: '',
	university: '',
	isLoading: true,
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

		fetch(ROUTES.BASE_URL + "/api/user", {
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
					isLoading: false
				});
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	flip = (region) => {
		var toSet = !this.state[region]
		this.setState({[region]: toSet})
	}

	onChange = event => {
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		this.setState({ [event.target.name]: value });

		if (event.target.name === "resume") {
			console.log(event.target.name)
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

		fetch(ROUTES.BASE_URL + '/api/user/ch-resume/' + email, {
			method: 'POST',
			body: data,
		})

		fetch(ROUTES.BASE_URL + "/api/user/ch-settings", {
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
		fetch(ROUTES.BASE_URL + "/api/user/delete", {
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
			resumeFile,
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
				<Columns className="is-multiline is-centered">
				<Columns.Column size={8}>
				<div className="custom-card" >
				<div className="custom-card__heading-gradient">
				<Heading size={1} className="has-text-centered custom-card__heading-text">Account Settings</Heading>
				</div>
				<form onSubmit={this.onSubmit} style={{padding:16}}>
				<div className="flex">
				<a href={ photoFile } target="_blank" style={{margin:"auto"}} rel="noopener noreferrer"><img alt="profile" id="photoData" src={ photoFile } style={{height:200,width:200,"border-radius":"100%"}}/></a>
				</div>
				<br/>
				<div className={"file is-centered" + (photo ? " is-success": "")}>
				<label className="file-label">
				<input className="file-input" type="file" name="photo" value={photo} id="photo" onChange={this.onChange}/>
				<span className="file-cta">
				<span className="file-icon">📤</span>
				<span className="file-label">
				Change profile picture...
				</span>
				</span>
				</label>
				</div>
				<br/>
				<div className="field">
				<label className="label">Name</label>
				<div className="control">
				<input
				className="input"
				name="username"
				value={username}
				onChange={this.onChange}
				type="text"
				placeholder="Full Name"
				/>
				</div>
				</div>
				<br/>
				<div className="field">
				<label className="label">Email</label>
				<div className="control">
				<input
				className="input"
				name="email"
				value={email}
				disabled={true}
				onChange={this.onChange}
				type="text"
				placeholder="Email Address"
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Password</label>
				<div className="control">
				<input
				className="input"
				name="passwordOne"
				value={passwordOne}
				onChange={this.onChange}
				type="password"
				placeholder="Password"
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Confirm Password</label>
				<div className="control">
				<input
				className="input"
				name="passwordTwo"
				value={passwordTwo}
				onChange={this.onChange}
				type="password"
				placeholder="Just to make sure..."
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Bio</label>
				<div className="control">
				<textarea className="textarea" name="bio" value={this.state.bio} onChange={this.onChange} type="text" placeholder="Tell us a little about your company..."/>
				</div>
				</div>
				<div className="field">
				<label className="label">University</label>
				<div className="control">
				<input
				className="input"
				name="university"
				value={university}
				onChange={this.onChange}
				type="text"
				placeholder="University"
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Major</label>
				<div className="control">
				<input
				className="input"
				name="major"
				value={major}
				onChange={this.onChange}
				type="text"
				placeholder="Major"
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Minor</label>
				<div className="control">
				<input
				className="input"
				name="minor"
				value={minor}
				onChange={this.onChange}
				type="text"
				placeholder="Minor"
				/>
				</div>
				</div>
				<div className="flex">
				<a style={{margin:"auto"}} href={ROUTES.BASE_URL + "/resumes/"+email+".pdf"} target="_blank" rel="noopener noreferrer">View your current resume</a>
				<br/>
				</div>
				<div className={"file is-centered" + (resumeFile ? " is-success": "")}>
				<label className="file-label">
				<input className={"file-input"} type="file" name="resume" value={resume} id="resume" onChange={this.onChange}/>
				<span className="file-cta">
				<span className="file-icon">📤</span>
				<span className="file-label">
				Upload your resume...
				</span>
				</span>
				</label>
				</div>
				<br/>
				<div className="select is-fullwidth">
				<select name="jobType" id="jobType" value={jobType} onChange={this.onChange}>
				<option value="" disabled selected hidden>What type of job do you want?</option>
				<option value="fullTime">Full Time</option>
				<option value="parttime">Part Time</option>
				<option value="internship">Internship</option>
				<option value="coop">Co-op</option>
				</select>
				</div>
				<br/>
				<br/>
				<div className="field">
				<label className="label">Desired wage</label>
				<div className="control">
				<input className="input" name="wage" value={wage} onChange={this.onChange} type="number" placeholder="Salary of Job"/>
				</div>
				</div>
				<br/>
				<Heading size={4} className="has-text-centered">Desired location</Heading>
				<div className="buttons has-addons is-centered">
				<span className={"button" + (this.state.northeast ? " is-info": "")} onClick={() => {this.flip("northeast")}}>Northeast</span>
				<span className={"button" + (this.state.west ? " is-info": "")} onClick={() => {this.flip("west")}}>West</span>
				<span className={"button" + (this.state.south ? " is-info": "")} onClick={() => {this.flip("south")}}>South</span>
				<span className={"button" + (this.state.midwest ? " is-info": "")} onClick={() => {this.flip("midwest")}}>Midwest</span>
				</div>

				<br/>
				<div className="field">
				<label className="label">Start Date</label>
				<div className="control">
				<input className="input" name="start" value={this.state.start} onChange={this.onChange} type="date"/>
				</div>
				</div>
				<div className="field">
				<label className="label">End Date</label>
				<div className="control">
				<input className="input" name="end" value={this.state.end} onChange={this.onChange} type="date"/>
				</div>
				</div>
				<br/>
				<Heading size={4} className="has-text-centered">General</Heading>
				<div className="buttons has-addons is-centered">
				<span className={"button" + (this.state.isHidden ? " is-info": "")} onClick={() => {this.flip("isHidden")}}>Hide Account</span>
				<span className={"button" + (this.state.emailNotifications ? " is-info": "")} onClick={() => {this.flip("emailNotifications")}}>Email Notifications</span>
				<span className={"button" + (this.state.desktopNotifications ? " is-info": "")} onClick={() => {this.flip("desktopNotifications")}}>Desktop Notifications</span>
				</div>
				<br/>
				<Heading size={4} className="has-text-centered">Danger Zone</Heading>
				<div className="buttons has-addons is-centered">
				<Button type="button" onClick={this.deleteAccount} className="is-danger">
				Delete Account
				</Button>
				</div>
				{(() => {
					if (error && error != '' && typeof(error) === "string") {
						setTimeout(() => {
							this.setState({error: null})
						}, 3000);

						return (
							<Notification color="danger" style={{margin: 16}}>
							{error}
							<Button remove onClick={() => {this.setState({error: null})}}/>
							</Notification>
						)
					}
				})()}
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
				<br/>
				<Button type="submit" disabled={isInvalid} className="is-info is-fullwidth">
				Save Preferences
				</Button>
				</form>
				</div>
				</Columns.Column>
				</Columns>
			);
		} else if (this.state.persona === "employer"){
			return (
				<Columns className="is-multiline is-centered">
				<Columns.Column size={6}>
				<div className="custom-card" >
				<div className="custom-card__heading-gradient">
				<Heading className="text-center custom-card__heading-text" size={1}>Account Settings</Heading>
				</div>
				<br/>
				<div>
				<form onSubmit={this.onSubmit} style={{padding:16}}>
				<div className="flex">
				<a href={ photoFile } target="_blank" style={{margin:"auto"}} rel="noopener noreferrer"><img alt="profile" id="photoData" src={ photoFile } style={{height:200,width:200,"border-radius":"100%"}}/></a>
				</div>
				<br/>
				<div className={"file is-centered" + (photo ? " is-success": "")}>
				<label className="file-label">
				<input className="file-input" type="file" name="photo" value={photo} id="photo" onChange={this.onChange}/>
				<span className="file-cta">
				<span className="file-icon">📤</span>
				<span className="file-label">
				Change profile picture...
				</span>
				</span>
				</label>
				</div>
				<br/>
				<div className="field">
				<label className="label">Name</label>
				<div className="control">
				<input
				className="input"
				name="username"
				value={username}
				onChange={this.onChange}
				type="text"
				placeholder="Full Name"
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Company Name</label>
				<div className="control">
				<input
				className="input"
				name="company"
				value={company}
				onChange={this.onChange}
				type="text"
				placeholder="Company"
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Email</label>
				<div className="control">
				<input
				className="input"
				name="email"
				value={email}
				disabled={true}
				onChange={this.onChange}
				type="text"
				placeholder="Email Address"
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Password</label>
				<div className="control">
				<input
				className="input"
				name="passwordOne"
				value={passwordOne}
				onChange={this.onChange}
				type="password"
				placeholder="Password"
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Confirm Password</label>
				<div className="control">
				<input
				className="input"
				name="passwordTwo"
				value={passwordTwo}
				onChange={this.onChange}
				type="password"
				placeholder="Just to make sure..."
				/>
				</div>
				</div>
				<div className="field">
				<label className="label">Bio</label>
				<div className="control">
				<textarea className="textarea" name="bio" value={this.state.bio} onChange={this.onChange} type="text" placeholder="Tell us a little about your company..."/>
				</div>
				</div>
				<br/>
				<Heading size={4} className="has-text-centered">Notifications</Heading>
				<div className="buttons has-addons is-centered">
				<span className={"button" + (this.state.emailNotifications ? " is-info": "")} onClick={() => {this.flip("emailNotifications")}}>Email</span>
				<span className={"button" + (this.state.desktopNotifications ? " is-info": "")} onClick={() => {this.flip("desktopNotifications")}}>Desktop</span>
				<span className={"button" + (this.state.favoriteNotifications ? " is-info": "")} onClick={() => {this.flip("favoriteNotifications")}}>Favorites</span>
				</div>
				<Heading size={4} className="has-text-centered">General</Heading>
				<div className="buttons has-addons is-centered">
				<span className={"button" + (this.state.isHidden ? " is-info": "")} onClick={() => {this.flip("isHidden")}}>Hide Account</span>
				</div>
				<Heading size={4} className="has-text-centered">Danger Zone</Heading>
				<div className="buttons has-addons is-centered">
				<Button type="button" onClick={this.deleteAccount} className="is-danger">
				Delete Account
				</Button>
				</div>
				{(() => {
					if (error && error != '' && typeof(error) === "string") {
						setTimeout(() => {
							this.setState({error: null})
						}, 3000);

						return (
							<Notification color="danger" style={{margin: 16}}>
							{error}
							<Button remove onClick={() => {this.setState({error: null})}}/>
							</Notification>
						)
					}
				})()}
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
				<br/>
				<Button type="submit" disabled={isInvalid} className="is-info is-fullwidth">
				Save Preferences
				</Button>
				</form>
				</div>
				</div>
				</Columns.Column>
				</Columns>
			);
		} else if (this.state.isLoading) {
			// TODO add loading symbol
			return (
				<Columns className="is-multiline is-centered">
				<Columns.Column size={6}>
				<div className="custom-card" >
				<div className="custom-card__heading-gradient">
				<Heading className="text-center custom-card__heading-text" size={1}>Account Settings</Heading>
				</div>
				<br/>
				<div>
				<span>
				<Loader className="auto-margin"
				style={{
					width: 100,
						height: 100,
						border: '4px solid',
						borderTopColor: 'transparent',
						borderRightColor: 'transparent',
				}}
				/>
				<br/>
				</span>
				</div>
				</div>
				</Columns.Column>
				</Columns>
			);
		}
	}
}

const AccountPage = compose(
	withRouter,
)(AccountPreferences)

export default AccountPage;
