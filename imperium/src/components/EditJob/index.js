import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const EditJobPage = () => (
  <div>
    <h1>Edit Job</h1>
    <EditJobPreferences />
  </div>
);

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
	error: null,
};

class EditJobPreferences extends Component {
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

				});
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	onChange = event => {
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		this.setState({ [event.target.name]: value });
	};

	onSubmit = event => {
		const {  bio, major, wage, jobType, midwest, northeast,
			west, south, start, end, jobName } = this.state;

		fetch("http://localhost:3000/api/user/ch-settings", {
			//can you send everything like this for employers
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
			error,
		} = this.state;
		console.log("render:" + jobType)
//TODO update this



		//add loading symbol
    console.log(jobType);
    console.log(bio);
		return (
		<div>
      <h1> please work</h1>
		</div>
	);

	}
}

// const EditJobPage = compose(
// 	withRouter,
// 	withFirebase,
// )(EditJobPreferences)

export default EditJobPage;
