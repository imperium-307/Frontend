import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import './Button.css';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Notification, Button, Heading, Columns, Field, Label, Control, Input } from 'react-bulma-components';

var pdf = false;
var jpeg = false;
var sub = true;

const SignUpPage = () => (
	<div>
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
	minor: '',
	university: '',
	company: '',
	resume: '',
	resumeFile: null,
	photo: '',
	photoFile: null,
	jobType: '',
	start: '',
	end: '',
	wage: '',
	northeast: false,
	south: false,
	west: false,
	midwest: false,
	error: null

};

class SignUpFormBase extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	onSubmit = event => {
		const { username, email, passwordOne, passwordTwo, persona, university,
			major, bio, company, criteria, resumeFile, photoFile,
			jobType, start, end, wage, minor, northeast, west, south, midwest } = this.state;

		const data = new FormData();
		data.append('file', resumeFile);

		if (persona == 'student') {
			fetch(ROUTES.BASE_URL + '/api/user/ch-resume/' + email, {
				method: 'POST',
				body: data,
			})
		}

		fetch(ROUTES.BASE_URL + "/api/user/signup", {
			body: JSON.stringify({
				username: username,
				email: email,
				password: passwordOne,
				passwordConfirm: passwordTwo,
				persona: persona,
				bio: bio,
				university: university,
				major: major,
				minor: minor,
				company: company,
				criteria: criteria,
				photo: photoFile,
				jobType: jobType,
				start: start,
				end: end,
				wage: wage,
				northeast: northeast,
				west: west,
				south: south,
				midwest: midwest,
				emailNotifications: true,
				desktopNotifications: true,
				favoriteNotifications: true
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
					localStorage.setItem('persona', persona)
					localStorage.setItem('myemail', email)

					if (persona === "student"){
						localStorage.setItem('token', res.token)
						this.props.history.push(ROUTES.HOME);
					} else {
						localStorage.setItem('token', res.token)
						this.props.history.push("/company/" + email);
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

	flip = (region) => {
		var toSet = !this.state[region]
		this.setState({[region]: toSet})
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		if (target.name === "resume") {
			this.setState({
				resumeFile: target.files[0]
			});
		}

		if (target.name === "photo") {
			var f = target.files[0];
			var r = new FileReader();
			r.onloadend = ()=> {
				this.setState({
					photoFile: r.result
				});
			}
			r.readAsDataURL(f);
		}

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
			resume,
			photo,
			photoFile,
			jobType,
			start,
			end,
			wage,
			minor,
			northeast,
			west,
			south,
			midwest,
			error
		} = this.state;

		//TODO check if new sign up options are empty

		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === '' ||
			email === '' ||
			username === '';


		return (
			<Columns className="is-multiline is-centered">
			<Columns.Column size={6}>
			<div className="custom-card" >
			<div className="custom-card__heading-gradient">
			<Heading size={3} className="has-text-centered custom-card__heading-text">Sign Up</Heading>
			</div>
			<form onSubmit={this.onSubmit} style={{padding: 16}}>
			<div className="field">
			<label className="label">Full Name</label>
			<div className="control">
			<input name="username" value={username} className="input" onChange={this.handleInputChange} type="text" placeholder="Full Name"/>
			</div>
			</div>
			<div className="field">
			<label className="label">Email</label>
			<div className="control">
			<input className="input" name="email"
			value={email}
			className="input"
			onChange={this.handleInputChange}
			type="email"
			placeholder="Email Address"
			/>
			</div>
			</div>
			<div className="field">
			<label className="label">Password</label>
			<div className="control">
			<input
			name="passwordOne"
			value={passwordOne}
			className="input"
			onChange={this.handleInputChange}
			type="password"
			placeholder="Password"
			/>
			</div>
			</div>
			<div className="field">
			<label className="label">Confirm Password</label>
			<div className="control">
			<input
			name="passwordTwo"
			value={passwordTwo}
			className="input"
			onChange={this.handleInputChange}
			type="password"
			placeholder="Just to make sure..."
			/>
			</div>
			</div>
			<br/>
			<div className="select is-fullwidth">
			<select name="persona" id="persona" value={persona} onChange={this.handleInputChange}>
			<option value="" disabled selected hidden>I am a...</option>
			<option value="student">Student</option>
			<option value="employer">Employer</option>
			</select>
			</div>
			<br/>
			<br/>
			<div>
			{(() => {
				if (persona === "student") {
					return (
						<div>
						<div className="field">
						<label className="label">University</label>
						<div className="control">
						<input className="input" name="university" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="University"/>
						</div>
						</div>
						<div className="field">
						<label className="label">Major</label>
						<div className="select is-fullwidth">
						<select name="major" id="major" value={major} onChange={this.handleInputChange}>
						<option value="" disabled selected hidden>What type of Major are you in?</option>
						<option value="art">Art</option>
						<option value="biology">Biology</option>
						<option value="com">Communications</option>
						<option value="cs">Computer Science</option>
						<option value="cm">Construction Management</option>
						<option value="ps">Political Science</option>
						<option value="ubw">Underwater Basket Weaving</option>
						</select>
						</div>
						</div>
						<div className="field">
						<label className="label">Minor</label>
						<div className="control">
						<input className="input" name="minor" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Minor"/>
						</div>
						</div>
						<div className="field">
						<label className="label">Bio</label>
						<div className="control">
						<textarea className="textarea" name="bio" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Tell us a little bit about yourself..."/>
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
						<div className={"file is-centered" + (resume ? " is-success": "")}>
						<label className="file-label">
						<input className={"file-input"} type="file" name="resume" value={resume} id="resume" onChange={this.handleInputChange}/>
						<span className="file-cta">
						<span className="file-icon">📤</span>
						<span className="file-label">
						Upload your resume...
						</span>
						</span>
						</label>
						</div>
						<br/>
						<div className="flex">
						{ photoFile ? (
						<a href={ photoFile } target="_blank" rel="noopener noreferrer" style={{margin:"auto"}}><img style={{height:200,width:200,"border-radius":"100%"}}id="photoData" src={ photoFile }/></a>
						) : (
							null
						)}
						</div>
						<br/>
						<div className={"file is-centered" + (photo ? " is-success": "")}>
						<label className="file-label">
						<input className="file-input" type="file" name="photo" value={photo} id="photo" onChange={this.handleInputChange}/>
						<span className="file-cta">
						<span className="file-icon">📤</span>
						<span className="file-label">
						Upload a profile picture...
						</span>
						</span>
						</label>
						</div>
						<br/>
						<div className="select is-fullwidth">
						<select name="jobType" id="jobType" value={jobType} onChange={this.handleInputChange}>
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
						<label className="label">Start Date</label>
						<div className="control">
						<input className="input" name="start" value={this.state.text} onChange={this.handleInputChange} type="date"/>
						</div>
						</div>
						<div className="field">
						<label className="label">End Date</label>
						<div className="control">
						<input className="input" name="end" value={this.state.text} onChange={this.handleInputChange} type="date"/>
						</div>
						</div>
						<div className="field">
						<label className="label">Desired wage</label>
						<div className="control">
						<input className="input" name="wage" value={this.state.text} onChange={this.handleInputChange} type="number" step=".1" placeholder="Desired Wage"/>
						</div>
						</div>
						</div>
					)
				} else if (persona === "employer") {
					return (
						<div>
						<div className="field">
						<label className="label">Company Name</label>
						<div className="control">
						<input className="input" name="company" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Company"/>
						</div>
						</div>
						<br/>
						<div className="field">
						<label className="label">Bio</label>
						<div className="control">
						<textarea className="textarea" name="bio" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Tell us a little about your company..."/>
						</div>
						</div>
						<div className="flex">
						{ photoFile ? (
						<a href={ photoFile } target="_blank" rel="noopener noreferrer" style={{margin:"auto"}}><img style={{height:200,width:200,"border-radius":"100%"}}id="photoData" src={ photoFile }/></a>
						) : (
							null
						)}
						</div>
						<br/>
						<div className={"file is-centered" + (photo ? " is-success": "")}>
						<label className="file-label">
						<input className="file-input" type="file" name="photo" value={photo} id="photo" onChange={this.handleInputChange}/>
						<span className="file-cta">
						<span className="file-icon">📤</span>
						<span className="file-label">
						Upload a profile picture...
						</span>
						</span>
						</label>
						</div>
						</div>
					)
				}
			})()}

			{(() => {
				var rString = resume.substring(resume.length-4, resume.length);
				if (rString === ".pdf"){
					pdf = true;
				}
				else {
					pdf = false;
				}
				var pString = photo.substring(photo.length-4, photo.length);
				if (pString.toLowerCase() === ".png"){
					jpeg = true;
				}
				else {
					jpeg = false;
				}
			})()}

			{(() => {
				if (jpeg){
					if(!isInvalid){
						if (persona === "employer" || pdf) {
							sub = false;
						}
						else {
							sub = true;
						}
					}
					else {
						sub = true;
					}
				}
				else {
					sub = true;
				}
			})()}

			{(() => {
				if (persona === "student"){
					if (major === '' || university === '' || bio === '' || jobType === '' || start === '' || end === '' || wage === '') {
						sub = true;
					}
					else {
						if (sub === false){
							sub = false;
						}
					}
				}
				else if (persona === "employer") {
					if (company === '' || bio === '') {
						sub = true;
					}
					else {
						if (sub === false){
							sub = false;
						}
					}
				}
				else {
					sub = true;
				}
			})()}

			</div>
			<br/>
			<Button className="is-fullwidth is-info" disabled={sub} type="submit">
			Sign Up
			</Button>
			</form>
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
			</Columns.Column>
			</Columns>
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
