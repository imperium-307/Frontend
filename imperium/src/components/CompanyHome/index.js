import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import { Container, Columns, Content, Image, Heading, Button, Card, Loader, Media } from 'react-bulma-components';

const INITIAL_STATE = {
  jobs: null,
  error: null
};

class CompanyHome extends Component {
	constructor(props) {
		super(props);

    this.state = { ...INITIAL_STATE };

		fetch("http://localhost:3000/api/user/get-all-jobs", {
			body: JSON.stringify({
				companyemail: "apple@example.com", // TODO set this to the company's email
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
					this.setState({ error: res.err });
				} else {
					this.setState({ jobs: res.jobs });
				}
			})
			.catch(error => {
				console.log(error);
				this.setState({ error });
			});
	}

	render() {
		const {company, jobs, error} = this.state;

		return (
			<div style={{'max-width': '960px', 'margin': 'auto'}}>
			<Heading className="has-text-centered" size={1}>TODO set this to company name</Heading>
			<Columns className="is-multiline is-centered">
			{(() => {
				if (jobs) {
					return jobs.map((job) => {
						return (
							<Columns.Column size={4} className="has-text-centered">
							<div className="custom-card">
							<br/>
							<span><b>Desired major:</b> {job.major}</span>
							<br/>
							<span><b>Job type:</b> {job.jobType}</span>
							<br/>

							<br/>
							<span><b>Location:</b> {job.location}</span>
							<br/>
							<span><b>Start:</b> {job.start}</span>
							<br/>
							<span><b>End:</b> {job.end}</span>
							<br/>
							<span><b>Estimated wage:</b> {job.wage}</span>
							<br/>

							{/* ok so this is just stupid.  I can't have this be /home/:email/:id because then the router matches the route without params (/home)? like what the hell? Maybe I'm missing something but that's seriously horrendous */}
							<Link to={"/homes/" + job.creator + "/" + job.id}>Match within this job</Link>
							<br/>
							<Link to={"/jobs/" + job.creator + "/" + job.id + "/edit"}>Edit this job</Link>
							</div>
							</Columns.Column>
						);
					});
				}
			})()}
			</Columns>
			<Link to={ROUTES.JOB_POSTING_CREATOR}>Create a Job Posting</Link>
			{error && <p>{error}</p>}
			</div>
		);
	}
}

export default compose(
	withRouter,
)(CompanyHome);
