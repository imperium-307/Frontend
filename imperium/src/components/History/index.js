import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const HistoryPage = () => (
	<div>
	<h1>History</h1>
	<HistoryList />
	</div>
)

var INITIAL_STATE = {
	history: {},
	persona: "",
	isLoading: true,
	error: null,
};

class HistoryList extends Component{
	constructor(props){
		super(props);
		this.state = { ...INITIAL_STATE };

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
					persona: res.persona,
					isLoading: false
				});
			})
			.catch(error => {
				this.setState({ error });
			});
	}


	render() {
		const { history, peronsa } = this.state;

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
						<p>You {this.state.history[i].action}d {this.state.history[i].data} on {this.state.history[i].date}</p>
					)
				})
			} else {
				return (
					<h1>You have no history</h1>
				)
			}
		}
	}
}

export default HistoryPage;
