import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

const styles = {
	fontFamily: "sans-serif",
	textAlign: "center",
	marginTop: "40px",
	color: "#421CE8"
};

const View = () => (
	<div style={styles}>
	<style>{'body { background-color: #DBDAE1; }'}</style>
	<h1>View user</h1>
	<GetACard />
	</div>
);

var INITIAL_STATE = {
	user: null,
	error: null,
};

class GetACardBase extends Component{
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
		fetch("http://localhost:3000/api/user/", {
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
				<p>Loading...</p>
				</div>
			);
		} else {
			const { user } = this.state;
			return(
				<div style={styles}>
				{(() => {

					if (user.jobType === "fullTime") {
						user.jobType = "a full time job";
					}
					else if (user.jobType === "internship") {
						user.jobType.jobType = "an internship";
					}
					else {
						user.jobType = " a co-op";
					}
					if (user.persona === "student") {

						return [
							<img src= { user.photo }/>,
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
							<img src= { user.photo }/>,
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

const GetACard = compose (
	withRouter,
)(GetACardBase);

export default View;

export {GetACard};
