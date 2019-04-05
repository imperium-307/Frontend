import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

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
		const { jobName, major, bio, location, jobType,northeast, west, south, midwest, start, end } = this.state;

		fetch("http://localhost:3000/api/user/create-job", {
			body: JSON.stringify({
				jobName: jobName,
				bio: bio,
				major: major,
				jobType: jobType,
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

		return(
			<div>
			<h1>Job Posting Creator</h1>
			<div>
			<input name="jobName" value={jobName} onChange={this.handleInputChange} type="text" placeholder="Name of Job"/>
			<br/>
			<input name="bio" value={bio} onChange={this.handleInputChange} type="text" placeholder="Job Description"/>
			<br/>
			<input name="location" value={location} onChange={this.handleInputChange} type="text" placeholder="Exact Location"/>
			<br/>
			<p>Please select what reigon that the positon will be in</p>
			<br/>
			<input name="northeast" value={northeast} onChange={this.handleInputChange} type="checkbox"/>
			<p>Northeast</p>
			<br/>
			<input name="west" value={west} onChange={this.handleInputChange} type="checkbox"/>
			<p>West</p>
			<br/>
			<input name="south" value={south} onChange={this.handleInputChange} type="checkbox"/>
			<p>South</p>
			<br/>
			<input name="midwest" value={midwest} onChange={this.handleInputChange} type="checkbox"/>
			<p>Midwest</p>
			<br/>
			<br/>
			<input name="major" value={major} onChange={this.handleInputChange} type="text" placeholder="Related Major"/>
			<br/>
			<br/>
			<select name="jobType" id="jobType" value={jobType} onChange={this.handleInputChange}>
			<option value="" disabled selected hidden>What type of job are you posting?</option>
			<option value="fullTime">Full Time</option>
			<option value="parttime">Part Time</option>
			<option value="internship">Internship</option>
			<option value="coop">Co-op</option>
			</select>
			<br/>
			<p2>Please enter when the postiton will start and end</p2>
			<br/>
			<input name="start" value={start} onChange={this.handleInputChange} type="date"/>
			<input name="end" value={end} onChange={this.handleInputChange} type="date"/>
			<br/>
			<input name="wage" value={wage} onChange={this.handleInputChange} type="number" step=".1" placeholder="Salary of Job"/>
			<br/>
			<button type="submit" onClick={this.onClick}>
			Create Posting
			</button>
			<Link to={"/company/" + localStorage.getItem('myemail')}>Cancel</Link>
			{error && <p>{error}</p>}
			</div>
			</div>
		)
	}
}

export default compose(
	withRouter,
)(CreateJobPosting);
