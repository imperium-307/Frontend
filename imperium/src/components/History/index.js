import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import { Columns, Button, Heading } from 'react-bulma-components';

var INITIAL_STATE = {
	history: {},
	persona: "",
	isLoading: true,
	error: null,
};

class HistoryPage extends Component{
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	componentDidMount = () => {
		if (localStorage.getItem('persona') === "student") {
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
						history: res.history,
						isLoading: false
					});
				})
				.catch(error => {
					this.setState({ error });
				});
		} else {
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
						history: res.history,
						isLoading: false
					});
				})
				.catch(error => {
					this.setState({ error });
				});
		}
	}

	render() {
		const { history, peronsa } = this.state;

		return (
			<Columns className="is-multiline is-centered">
			<Columns.Column size={8}>
			<div className="custom-card" >
			<div className="custom-card__heading">
			<Heading className="text-center custom-card__heading-text" size={1}>Your History</Heading>
			</div>
			<br/>
			<div>
			{(() => {
				if (this.state.isLoading) {
					return (
						<div>
						<p>Loading...</p>
						</div>
					);
				} else {
					if (this.state.history) {
						return (
							<table className="table">
							<thead>
							<tr>
							<th>👍/👎</th>
							<th>👤</th>
							<th>📅</th>
							<th>🕒</th>
							</tr>
							</thead>
							<tbody>
							{(() => {
								return this.state.history.map((d, i) => {
									return (
										<tr>
										<td>{d.action}</td>
										<td>{d.data}</td>
										<td>{new Date(this.state.history[i].date).toLocaleDateString("en-US")}</td>
										<td>{new Date(this.state.history[i].date).toLocaleTimeString("en-US")}</td>
										</tr>
									)
									/*
										<div className="flex" style={{padding: 16, "justify-content": "space-between", "background-color": bgcolor}}>
										<p>hi</p>
										<p>hi</p>
										<p>hi</p>
										<p>hi</p>
										<p>You {this.state.history[i].action}d {this.state.history[i].data} on {new Date(this.state.history[i].date).toLocaleDateString("en-US")} at {new Date(this.state.history[i].date).toLocaleTimeString("en-US")}</p>
										</div>
										*/
								})
							})()}
							</tbody>
							</table>
						)
					}
				}
			})()}
			</div>
			<br/>
			</div>
			</Columns.Column>
			</Columns>
		)
	}
}

export default compose(
	withRouter,
)(HistoryPage);
