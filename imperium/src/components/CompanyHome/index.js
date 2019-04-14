import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import { Heading, Columns, Loader } from 'react-bulma-components';

const INITIAL_STATE = {
	company: {},
  jobs: null,
	isLoading: true,
  error: null
};

class CompanyHome extends Component {
	constructor(props) {
		super(props);

    this.state = { ...INITIAL_STATE };

		fetch("http://localhost:3000/api/user/get-all-jobs", {
			body: JSON.stringify({
				companyemail: this.props.match.params.email,
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
					console.log(res)
					this.setState({ jobs: res.jobs, company: res.company });
				}

				this.setState({ isLoading: false });
			})
			.catch(error => {
				console.log(error);
				this.setState({ error });
			});
	}

	render() {
		const {company, isLoading, jobs, error} = this.state;

		// TODO we should use the company thing (see line above) to show a nice heading with a prof pic and all that
		if (isLoading) {
			return (
				<div style={{'maxWidth': '960px', 'margin': 'auto'}}>
				<Loader className="auto-margin"
				style={{
					width: 100,
						height: 100,
						border: '4px solid',
						borderTopColor: 'transparent',
						borderRightColor: 'transparent',
				}}
				/>
				</div>
			)
		} else {
			return (
				<div style={{'maxWidth': '960px', 'margin': 'auto'}}>
				<Heading className="has-text-centered" size={1}>{company.company}'s home</Heading>
				<Columns className="is-multiline is-centered">
				{(() => {
					if (jobs) {
						return jobs.map((job) => {
							return (
								<Columns.Column size={4} className="has-text-centered">
								<div className="custom-card">
								<br/>
								<Heading className="has-text-centered" size={3}>{job.jobName}</Heading>
								<hr/>
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

								{/* TODO should a student be able to browse a company's page? I think so */}
								{(() => {
									if (localStorage.getItem('persona') === "employer") {
										return (
											<div>
											<Link to={"/home/" + job.email}>Match within this job</Link>
											<br/>
											<Link to={"/matches/" + job.email}>View Matches within this job</Link>
											<br/>
											<Link to={"/history/" + job.email}>View job history</Link>
											<br/>
											<Link to={"/editjob/" + job.email}>Edit this job</Link>
											</div>
										)
									}
								})()}
								<br/>
								</div>
								</Columns.Column>
							);
						});
					}
				})()}
				</Columns>
				{(() => {
					if (localStorage.getItem('myemail') === company.email) {
						return (<Link to={ROUTES.JOB_POSTING_CREATOR}>Create a Job Posting</Link>)
					}
				})()}
				{error && <p>{error}</p>}
				</div>
			);
		}
	}
}

export default compose(
	withRouter,
)(CompanyHome);
