import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import './index.css'; 
import { Container, Columns, Content, Image, Heading, Button, Card, Loader, Media } from 'react-bulma-components';

var INITIAL_STATE = {
	user: null,
	error: null,
};

// This will either view a user or A SINGLE JOB. To view a company, use CompanyHome
class ViewComponent extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
		fetch("http://localhost:3000/api/user/view/" + this.props.match.params.email, {
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
							<img id="photoData" src= { user.photo }/>,
							<br/>,
							<p1>Name: {user.username}</p1>,
							<br/>,
							<p1>University: {user.university}</p1>,
							<br/>,
							<p1>Major: {user.major}</p1>,
							<br/>,
							<p1>Minor: {user.minor}</p1>,
							<br/>,
							<p1>Bio: {user.bio}</p1>,
							<br/>,
							<a href={"http://localhost:3000/resumes/"+user.email+".pdf"}>View resume</a>,
							<br/>,
							<p1>Looking for {user.jobType}</p1>,
							<br/>,
							<p1>Start: {user.start} End: {user.end}</p1>,
							<br/>,
							<p1>Prefered Wage: {user.wage}</p1>,
							<br/>,
						]
					}
					else {
						return[
							<img id="photoData" src= { user.photo }/>,
							<br/>,
							<p1>Compnay: {user.company}</p1>,
							<br/>,
							<p1>Major: {user.major}</p1>,
							<br/>,
							<p1>Job Description: {user.bio}</p1>,
							<br/>,
							<p1>Type of job is {user.jobType}</p1>,
							<br/>,
							<p1>Start: {user.start} End: {user.end}</p1>,
							<br/>,
							<p1>Wage: {user.wage}</p1>,
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
