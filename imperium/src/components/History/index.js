import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';

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
			<div>
			<h1>History</h1>
			{(() => {
				if (this.state.isLoading) {
					return (
						<div>
						<p>Loading...</p>
						</div>
					);
				} else {
					if (this.state.history) {
						return this.state.history.map((d, i) => {
							return (
								<p>You {this.state.history[i].action}d {this.state.history[i].data} on {new Date(this.state.history[i].date).toLocaleDateString("en-US")} at {new Date(this.state.history[i].date).toLocaleTimeString("en-US")}</p>
							)
						})
					} else {
						return (
							<h1>You have no history</h1>
						)
					}
				}
			})()}
			</div>
		)
	}
}

export default compose(
	withRouter,
)(HistoryPage);
