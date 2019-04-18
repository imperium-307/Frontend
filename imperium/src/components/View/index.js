import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import './index.css';
import { Heading } from 'react-bulma-components';

var INITIAL_STATE = {
	user: null,
	error: null,
};

// This will either view a user or A SINGLE JOB. To view a company, use CompanyHome
class ViewComponent extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
		console.log(ROUTES.BASE_URL);
		console.log(this.props.match.params.email);
		fetch(ROUTES.BASE_URL + "/view/" , {
			body: JSON.stringify({
				token: localStorage.getItem('token'),
				email: this.props.match.params.email
			}),
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'content-type': 'application/json'
			},
			mode: 'cors',
			method: 'GET'
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				this.setState({
					user: res
				});
			})
			.catch(error => {
				console.log("here");
				this.setState({ error });
			});
	}
	render() {
		if (!this.state || !this.state.user) {
			return(
				<div>
				<Heading className="has-text-centered" size={1}>View Student</Heading>
				<p>Loading...</p>
				</div>
			);
		} else {
			const { user } = this.state;
			return(
				<div>
				<Heading className="has-text-centered" size={1}>View Student</Heading>
				{(() => {

					if (user.jobType === "fullTime") {
						user.jobType = "a full time job";
					}
					else if (user.jobType === "internship") {
						user.jobType = "an internship";
					}
					else {
						user.jobType = " a co-op";
					}
					if (user.persona === "student") {

						return [
							<img alt="profile" id="photoData" src= { user.photo }/>,
							<br/>,
							<p>Name: {user.username}</p>,
							<br/>,
							<p>University: {user.university}</p>,
							<br/>,
							<p>Major: {user.major}</p>,
							<br/>,
							<p>Minor: {user.minor}</p>,
							<br/>,
							<p>Bio: {user.bio}</p>,
							<br/>,
							<a href={ROUTES.BASE_URL + "/resumes/"+user.email+".pdf"}>View resume</a>,
							<br/>,
							<p>Looking for {user.jobType}</p>,
							<br/>,
							<p>Start: {user.start} End: {user.end}</p>,
							<br/>,
							<p>Prefered Wage: {user.wage}</p>,
							<br/>,
						]
					}
					else {
						return[
							<p>job profile</p>,
							<img alt="profile" id="photoData" src= { user.photo }/>,
							<br/>,
							<p>Compnay: {user.company}</p>,
							<br/>,
							<p>Major: {user.major}</p>,
							<br/>,
							<p>Job Description: {user.bio}</p>,
							<br/>,
							<p>Type of job is {user.jobType}</p>,
							<br/>,
							<p>Start: {user.start} End: {user.end}</p>,
							<br/>,
							<p>Wage: {user.wage}</p>,
							<br/>,
						]
					}
				})()}
				</div>
			);
		}
	}
}

const View = compose (
	withRouter,
)(ViewComponent);

export default View;
