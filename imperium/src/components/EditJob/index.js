import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

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
  isLoading: true,
	error: null,
};

class EditJobPreferences extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
    if (!this.props.match || !this.props.match.params.jobid) {
				this.props.history.push("/company/" + localStorage.getItem('myemail'));
			}
    fetch("http://localhost:3000/api/user/get-job", {
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
            location: res.location,
            isLoading: false,
					});
				})
				.catch(error => {
					this.setState({ error });
				});
	}

  // componentDidMount = ()=> {
  //
  // }

	onChange = event => {
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		this.setState({ [event.target.name]: value });
	};

	onSubmit = event => {
		const {  bio, major, wage, jobType, midwest, northeast,
			west, south, start, end, jobName, location } = this.state;

		fetch("http://localhost:3000/api/user/ch-job", {
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
				token: localStorage.getItem('token'),
        location: location,
        jobid: this.props.match.params.jobid,
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
					bio: res.user.bio,
					major: res.user.major,
					wage: res.user.wage,
					northeast: res.user.northeast,
					west: res.user.west,
					south: res.user.south,
					midwest: res.user.midwest,
					start: res.user.start,
					jobType: res.user.jobType,
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
		} = this.state;
//TODO update this



		//add loading symbol
    
		return (
		<div>
      <h1>Edit Job Posting</h1>
    <form onSubmit={this.onSubmit}>
      <input
      name="jobName"
      value={jobName}
      onChange={this.onChange}
      type="text"
      placeholder="Job Name"
      />
      <br/>
      <input
      name="bio"
      value={bio}
      onChange={this.onChange}
      type="text"
      placeholder="Job Name"
      />
      <br/>
      <input
      name="location"
      value={location}
      onChange={this.onChange}
      type="text"
      placeholder="Job Name"
      />
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
      <input
      name="major"
      value={major}
      onChange={this.onChange}
      type="text"
      placeholder="Job Name"
      />
      <br/>
      <select name="jobType" id="jobType" value={jobType} onChange={this.onChange}>
      <option value="" disabled selected hidden>What type of job are you posting?</option>
      <option value="fullTime">Full Time</option>
      <option value="parttime">Part Time</option>
      <option value="internship">Internship</option>
      <option value="coop">Co-op</option>
    </select>
      <br/>
      <input name="start" value={start} onChange={this.onChange} type="date"/>
			<input name="end" value={end} onChange={this.onChange} type="date"/>
			<br/>
      <input name="wage" value={wage} onChange={this.onChange} type="number" step=".1" placeholder="Salary of Job"/>
			<br/>
      <button type="submit">
			   Save Preferences
			</button>
    </form>

		</div>
	);

	}
}

// const EditJobPage = compose(
// 	withRouter,
// 	withFirebase,
// )(EditJobPreferences)
export default compose(
  withRouter
)(EditJobPreferences)
//export default EditJobPage;
