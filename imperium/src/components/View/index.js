import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import "./index.css";
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Notification, Columns, Content, Image, Heading, Button, Card, Loader, Media } from 'react-bulma-components';

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
		fetch("http://localhost:3000/api/user/view/" + this.props.match.params.email , {
			// body: JSON.stringify({
			// 	token: localStorage.getItem('token'),
			// 	email: this.props.match.params.email
			// }),
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
		console.log(this.state.user);
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
					if (user.persona === "student") {
						var jobType = "";
				switch(user.jobType) {
					case "fullTime":
						jobType = "a full time job";
						break;
					case "internship":
						jobType = "an internship";
						break;
					case "coop":
						jobType = " a co-op";
						break;
					case "parttime":
						jobType = " a part time job"
						break;
				}
						return [
							<div className="has-text-centered">
							<div className="flex" style={{"justify-content":"center"}}>
							<img style={{width: 200, height: 200, "margin-right": 16, "border-radius":"100%"}} src={user.photo}/>
							{(() => {
								if (user.favorites && this.props && this.props.match && this.props.match.params.jobid && user.favorites.includes(this.props.match.params.jobid)) {
									console.log("here")
									return (
										<div>
										<Heading size={4}>💖</Heading>
										</div>
									)
								}
							})()}
							</div>
							<br/>
							<Heading size={2}>{user.username}</Heading>

							<Button>
							<a target="_blank" href={ROUTES.BASE_URL + "/resumes/"+user.email+".pdf"}>View resume</a>
							</Button>
							<br/>
							<br/>

							<i>{user.bio}</i>
							<br/>

							<br/>
							<span><b>Major:</b> {user.major}</span>
							{ (user.minor !== '' && user.minor !== 'none') ? (
								<span>
								<br/>
								<span><b>Minor:</b> {user.minor}</span>
								</span>
							) : (
								null
							)}
							<br/>
							<span><b>Looking for:</b> {user.jobType}</span>
							<br/>

							<br/>
							<span><b>Start:</b> {user.start}</span>
							<br/>
							<span><b>End:</b> {user.end}</span>
							<br/>
							<span><b>Desired wage:</b> {user.wage}</span>
							<br/>



							</div>
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
