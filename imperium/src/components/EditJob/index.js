import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Loader, Notification, Button, Heading, Columns, Field, Label, Control, Input } from 'react-bulma-components';

const INITIAL_STATE = {
	jobName: '',
	bio: '',
	major: '',
	resume: '',
	jobType: '',
	wage: '',
	northeast: '',
	west: '',
	south: '',
	midwest: '',
	start: '',
	end: '',
	jobName: '',
	location:'',
	isHidden: null,
	emailNotifications: '',
	desktopNotifications: '',
	favoriteNotifications: '',
	chatNotifications: '',
	isLoading: true,
	savedPrefPopup: false,
	error: null,
};

class EditJobPreferences extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
		if (!this.props.match || !this.props.match.params.jobid) {
			this.props.history.push("/company/" + localStorage.getItem('myemail'));
		}
		fetch(ROUTES.BASE_URL + "/api/user/get-job", {
			body: JSON.stringify({
				jobid: this.props.match.params.jobid,
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
					bio: res.bio,
					major: res.major,
					wage: res.wage,
					jobType: res.jobType,
					northeast: res.northeast,
					west: res.west,
					south: res.south,
					midwest: res.midwest,
					start: res.start,
					end: res.end,
					jobName: res.jobName,
					isHidden: res.isHidden,
					location: res.location,
					isLoading: false,
					emailNotifications: res.emailNotifications,
					desktopNotifications: res.desktopNotifications,
					favoriteNotifications: res.favoriteNotifications,
					chatNotifications: res.chatNotifications,
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
	};

	onSubmit = event => {
		const {  bio, major, wage, jobType, midwest, northeast,
			west, south, start, emailNotifications, desktopNotifications, favoriteNotifications, chatNotifications, end, jobName, location, isHidden } = this.state;

		fetch(ROUTES.BASE_URL + "/api/user/ch-job", {
			body: JSON.stringify({
				jobType: jobType,
				bio: bio,
				major: major,
				wage: wage,
				northeast: northeast,
				west: west,
				south: south,
				midwest: midwest,
				start: start,
				end: end,
				jobName: jobName,
				isHidden: isHidden,
				token: localStorage.getItem('token'),
				location: location,
				jobid: this.props.match.params.jobid,
				emailNotifications: emailNotifications,
				desktopNotifications: desktopNotifications,
				favoriteNotifications: favoriteNotifications,
				chatNotifications: chatNotifications,
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
					savedPrefPopup: true
				});

				setTimeout(() => {
					this.setState({
						savedPrefPopup: false
					});
				}, 5000)

				this.setState({
					bio: res.user.bio,
					major: res.user.major,
					wage: res.user.wage,
					northeast: res.user.northeast,
					west: res.user.west,
					emailNotifications: res.emailNotifications,
					desktopNotifications: res.desktopNotifications,
					favoriteNotifications: res.favoriteNotifications,
					chatNotifications: res.chatNotifications,
					south: res.user.south,
					midwest: res.user.midwest,
					start: res.user.start,
					jobType: res.user.jobType,
					isHidden: isHidden,
					end: res.user.end,
					jobName: res.user.jobName,
					location: res.user.location,
				});
			})
			.catch(error => {
				this.setState({ error });
			});

		event.preventDefault();
	}

	render() {
		const {
			jobType,
			bio,
			major,
			resume,
			wage,
			northeast,
			west,
			south,
			midwest,
			start,
			end,
			jobName,
			location,
			error,
			isHidden,
		} = this.state;

		var isDisabled = false;
		if (jobType === '' || start === '' || end === '' || location === '' || jobName === '' || (!south && !midwest && !northeast && !west) || major === '' || bio === '' || wage === '') {
			isDisabled = true;
		}

		return (
			<Columns className="is-multiline is-centered">
			<Columns.Column size={6}>
			<div className="custom-card" >
			<div className="custom-card__heading-gradient">
			<Heading size={3} className="has-text-centered custom-card__heading-text">Edit Job</Heading>
			</div>
			{(() => {
				if (this.state.isLoading) {
					return (
						<span>
						<br/>
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
					)
				} else {
					return (
						<form onSubmit={this.onSubmit} style={{padding: 16}}>
						<div className="field">
						<label className="label">Job Name</label>
						<div className="control">
						<input
						className="input"
						name="jobName"
						value={jobName}
						onChange={this.onChange}
						type="text"
						placeholder="Job Name"
						/>
						</div>
						</div>
						<div className="field">
						<label className="label">Job Description</label>
						<div className="control">
						<input
						className="input"
						name="bio"
						value={bio}
						onChange={this.onChange}
						type="text"
						placeholder="Job Description"
						/>
						</div>
						</div>
						<div className="field">
						<label className="label">Job Location</label>
						<div className="control">
						<input
						className="input"
						name="location"
						value={location}
						onChange={this.onChange}
						type="text"
						placeholder="Job Location"
						/>
						</div>
						</div>
						<Heading size={4} className="has-text-centered">Job Region</Heading>
						<div className="buttons has-addons is-centered">
						<span className={"button" + (this.state.northeast ? " is-info": "")} onClick={() => {this.flip("northeast")}}>Northeast</span>
						<span className={"button" + (this.state.west ? " is-info": "")} onClick={() => {this.flip("west")}}>West</span>
						<span className={"button" + (this.state.south ? " is-info": "")} onClick={() => {this.flip("south")}}>South</span>
						<span className={"button" + (this.state.midwest ? " is-info": "")} onClick={() => {this.flip("midwest")}}>Midwest</span>
						</div>
						<div className="field">
						<label className="label">Major</label>
						<div className="select is-fullwidth">
						<select name="major" id="major" value={major} onChange={this.onChange}>
						<option value="" disabled selected hidden>What type of Major are you in?</option>
						<option value="Art">Art</option>
						<option value="Biology">Biology</option>
						<option value="Communications">Communications</option>
						<option value="Computer Science">Computer Science</option>
						<option value="Construction Management">Construction Management</option>
						<option value="Political Science">Political Science</option>
						<option value="Agriculture">Agriculture</option>
						<option value="Food Science">Food Science</option>
						<option value="Music">Music</option>
						<option value="Studio Arts">Studio Arts</option>
						<option value="Ecology">Ecology</option>
						<option value="Biology">Biology</option>
						<option value="Neuroscience">Neuroscience</option>
						<option value="Journalism">Journalism</option>
						<option value="Mathematics">Mathematics</option>
						<option value="Architecture">Architecture</option>
						<option value="Engineering">Engineering</option>
						<option value="Philosophy">Philosophy</option>
						<option value="Underwater Basket Weaving">Underwater Basket Weaving</option>
						</select>
						</div>
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
						<div className="field">
						<label className="label">Estimated wage</label>
						<div className="control">
						<input className="input" name="wage" value={this.state.wage} onChange={this.onChange} type="number" step=".1" placeholder="Estimated Wage"/>
						<br/>
						<br/>
						<Heading size={4} className="has-text-centered">General</Heading>
						<div className="buttons has-addons is-centered">
						<span className={"button" + (this.state.isHidden ? " is-info": "")} onClick={() => {this.flip("isHidden")}}>Hide Job</span>
						</div>
						</div>
						</div>
						<Heading size={4} className="has-text-centered">Notifications</Heading>
						<div className="buttons has-addons is-centered">
						<span className={"button" + (this.state.emailNotifications ? " is-info": "")} onClick={() => {this.flip("emailNotifications")}}>Match</span>
						<span className={"button" + (this.state.desktopNotifications ? " is-info": "")} onClick={() => {this.flip("desktopNotifications")}}>Desktop</span>
						<span className={"button" + (this.state.favoriteNotifications ? " is-info": "")} onClick={() => {this.flip("favoriteNotifications")}}>Favorites</span>
						<span className={"button" + (this.state.chatNotifications ? " is-info": "")} onClick={() => {this.flip("chatNotifications")}}>Chat</span>
						</div>
						<br/>
						<Button className="is-fullwidth is-info" disabled={isDisabled} type="submit">
						Save Changes
						</Button>
						{(() => {
							console.log(this.state.savedPrefPopup)
							if (this.state.savedPrefPopup) {
								return (
									<Notification color="success">
									Your settings have been saved
									<Button remove onClick={() => {this.setState({savedPrefPopup: false})}}/>
									</Notification>
								)
							}
						})()}
						<br/>
						<Button className="is-fullwidth is-danger" to={"/company/" + localStorage.getItem('myemail')} renderAs={Link}>Cancel</Button>
						</form>
					)
				}
			})()}
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

export default compose(
	withRouter
)(EditJobPreferences)
