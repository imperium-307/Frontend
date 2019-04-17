import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { Notification, Button, Heading, Columns, Field, Label, Control, Input } from 'react-bulma-components';

//TODO make it so you cant click the create posting button without entering all the fields

var INITIAL_STATE = {
	jobName: '',
	jobType: '',
	location: '',
	west: '',
	south: '',
	midwest: '',
	northeast: '',
	major: '',
	bio:'',
	wage:'',
	start: '',
	end: '',
	error: ''
};

class CreateJobPosting extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onClick = event => {
		const { jobName, wage, major, bio, location, jobType,northeast, west, south, midwest, start, end } = this.state;

		fetch(ROUTES.BASE_URL + "/api/user/create-job", {
			body: JSON.stringify({
				jobName: jobName,
				bio: bio,
				major: major,
				jobType: jobType,
				wage: wage,
				northeast: northeast,
				west: west,
				start: start,
				end: end,
				south: south,
				midwest: midwest,
				location: location,
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
					console.log("create job failed")
					this.setState({ error: res.err });
				} else {
					this.props.history.push("/company/" + localStorage.getItem('myemail'));
				}
				console.log(res)
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

	handleInputChange = event => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	render(){
		const {error, jobType, start, end, location, west, jobName, south, midwest, northeast, major, bio, wage} = this.state;

		var isDisabled = false;
		if (jobType === '' || start === '' || end === '' || location === '' || jobName === '' || (!south && !midwest && !northeast && !west) || major === '' || bio === '' || wage === '') {
			isDisabled = true;
		}

		return(
			<Columns className="is-multiline is-centered">
			<Columns.Column size={6}>
			<div className="custom-card" >
			<div className="custom-card__heading-gradient">
			<Heading size={3} className="has-text-centered custom-card__heading-text">Create Job</Heading>
			</div>
			<form onSubmit={this.onSubmit} style={{padding: 16}}>
			<div className="field">
			<label className="label">Job Name</label>
			<div className="control">
			<input className="input" name="jobName" value={jobName} onChange={this.handleInputChange} type="text" placeholder="Name of Job"/>
			</div>
			</div>
			<div className="field">
			<label className="label">Job Description</label>
			<div className="control">
			<input className="input" name="bio" value={bio} onChange={this.handleInputChange} type="text" placeholder="Job Description"/>
			</div>
			</div>
			<div className="field">
			<label className="label">Job Location</label>
			<div className="control">
			<input className="input" name="location" value={location} onChange={this.handleInputChange} type="text" placeholder="Exact Location"/>
			</div>
			</div>
			<br/>
			<Heading size={4} className="has-text-centered">Job Location</Heading>
			<div className="buttons has-addons is-centered">
			<span className={"button" + (this.state.northeast ? " is-info": "")} onClick={() => {this.flip("northeast")}}>Northeast</span>
			<span className={"button" + (this.state.west ? " is-info": "")} onClick={() => {this.flip("west")}}>West</span>
			<span className={"button" + (this.state.south ? " is-info": "")} onClick={() => {this.flip("south")}}>South</span>
			<span className={"button" + (this.state.midwest ? " is-info": "")} onClick={() => {this.flip("midwest")}}>Midwest</span>
			</div>
			<div className="field">
			<label className="label">Major</label>
			<div className="select is-fullwidth">
			<select name="major" id="major" value={major} onChange={this.handleInputChange}>
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
			<input className="input" name="start" value={this.state.start} onChange={this.handleInputChange} type="date"/>
			</div>
			</div>
			<div className="field">
			<label className="label">End Date</label>
			<div className="control">
			<input className="input" name="end" value={this.state.end} onChange={this.handleInputChange} type="date"/>
			</div>
			</div>
			<div className="field">
			<label className="label">Estimated wage</label>
			<div className="control">
			<input className="input" name="wage" value={this.state.wage} onChange={this.handleInputChange} type="number" step=".1" placeholder="Estimated Wage"/>
			</div>
			</div>
			<br/>
			<Button className="is-fullwidth is-info" disabled={isDisabled} type="submit">
			Create Job
			</Button>
			<br/>
			<Button className="is-fullwidth is-danger" to={"/company/" + localStorage.getItem('myemail')} renderAs={Link}>Cancel</Button>
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
			</form>
			</div>
			</Columns.Column>
			</Columns>
		)
	}
}

export default compose(
	withRouter,
)(CreateJobPosting);
