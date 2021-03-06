import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import { Content, Media, Image, Heading, Columns, Loader, Button } from 'react-bulma-components';

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

		fetch(ROUTES.BASE_URL + "/api/user/get-all-jobs", {
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
				<Columns className="is-multiline is-centered">
				<Columns.Column size={12} className="has-text-centered">
				<div className="custom-card" style={{padding: "16px"}}>
				<Media>
				<Media.Item position="left">
				<Image style={{width: 150, height: 150}}  alt={"profile"} src={company.photo} />
				</Media.Item>
				<Media.Item>
				<Content>
				<Heading className="has-text-left" size={1}>{company.company}</Heading>
				<p>{company.bio}</p>
				{(() => {
					if (localStorage.getItem('myemail') === company.email) {
						return (
							<div className="buttons has-addons">
							<Button to={ROUTES.JOB_POSTING_CREATOR} renderAs={Link} className="is-info">New Job Posting</Button>
							<Button to={"/account"} renderAs={Link}>Edit your company</Button>
							</div>
						)
					} else {
						return (
							<Button href={"mailto:" + company.email} renderAs="a">Contact {company.company}</Button>
						)
					}

				})()}
				</Content>
				</Media.Item>
				</Media>
				</div>
				</Columns.Column>
				{(() => {
					if (jobs) {
						return jobs.map((job) => {
							return (
								<Columns.Column size={4} className="has-text-centered">
								<div className="custom-card">
								<div className="custom-card__heading">
								<Heading className="has-text-centered custom-card__heading-text" size={3}>{job.jobName}</Heading>
								</div>
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

								{/* TODO should a student be able to browse a company's page? I think so */}
								{(() => {
									if (localStorage.getItem('myemail') === company.email) {
										return (
											<div style={{padding: "16px"}}>
											<Button to={"/home/" + job.email} renderAs={Link} className="is-info is-fullwidth">Match within this job</Button>
											<br/>
											<div className="buttons has-addons is-centered">
											<Button to={"/matches/" + job.email} renderAs={Link}>Matches</Button>
											<Button to={"/history/" + job.email} renderAs={Link}>History</Button>
											<Button to={"/editjob/" + job.email} renderAs={Link}>Edit</Button>
											</div>
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
				{error && <p>{error}</p>}
				</div>
			);
		}
	}
}

export default compose(
	withRouter,
)(CompanyHome);
