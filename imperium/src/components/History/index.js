import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';
import { Loader, Columns, Button, Heading } from 'react-bulma-components';

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
			<div className="custom-card__heading-gradient">
			<Heading className="text-center custom-card__heading-text" size={1}>Your History</Heading>
			</div>
			<br/>
			<div>
			{(() => {
				if (this.state.isLoading) {
					return (
						<span>
						<br/>
						<Loader className="auto-margin"
						style={{
							width: 100,
								height: 100,
								border: '4px solid',
								borderTopColor: 'transparent',
								borderRightColor: 'transparent',
						}}
						/>
						<br/>
						</span>
					);
				} else {
					if (this.state.history) {
						return (
							<div style={{"overflow-x": "auto"}}>
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
								})
							})()}
							</tbody>
							</table>
							</div>
						)
					} else {
						if (localStorage.getItem('persona') === "student") {
							return (
								<div className="has-text-centered">
								<br/>
								<br/>
								<Heading className="text-center" size={3}>You don't have any history!</Heading>
								<Button className="is-info" to={"/home"} renderAs={Link}>Make some‽</Button>
								<br/>
								<br/>
								</div>
							)
						} else {
							return (
								<div className="has-text-centered">
								<br/>
								<br/>
								<Heading className="text-center" size={3}>You don't have any history!</Heading>
								<Button className="is-info" to={"/home/" + this.props.match.params.jobid} renderAs={Link}>Make some‽</Button>
								<br/>
								<br/>
								</div>
							)
						}
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
