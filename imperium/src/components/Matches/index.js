import React from 'react';
import './matches.css';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Heading } from 'react-bulma-components';

class Matches extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			matches: []
		}
if (localStorage.getItem('persona') === "student"){
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
				var matches = res.matches;
				this.setState({ matches });
			})
			.catch(error => {
				this.setState({ error });
			});

		}
		else {

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
						var matches = res.matches;
						console.log("your matches " + matches);
						this.setState({ matches });
					})
					.catch(error => {
						console.log("here");
						console.log("jobid: " + this.state.jobid)
						this.setState({ error });
					});
		}
	}
	removeChild = (email) => {
		var matches = this.state.matches
		matches = matches.filter(e => e !== email)
		this.setState({ matches });
	}

	unmatch = (email) => {
		fetch("http://localhost:3000/api/user/dislike", {
			body: JSON.stringify({
				token: localStorage.getItem('token'),
				likee: email
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
				//this.props.removeChild(email);
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	GoToChat = (email) => {
		this.props.history.push("/chat/" + email)
	}

	render() {
		let body;
		if (this.state.matches) {
		//	console.log("your matches " + this.state.matches);

			body = this.state.matches.map((d, i) => {
				return (
					<li className="user_details">
					<p>{d}</p>
					<div className="user_contact">
					<button onClick={this.unmatch}>Unmatch</button>
					<button>Chat</button>
					{(() => {
						if (localStorage.getItem('persona') === "student") {

							// TODO this needs lots of work
							// TODO should we add a button to show them the company's profile?
							return (
								<Link to={"/jobs/" + d }>View Posting</Link>
							);
						} else {
							return (
								<Link to={"/view/" + d }>View Profile</Link>
							);
						}
					})()}
					<button onClick={() => {this.GoToChat(d)}}>Chat</button>
					</div>
					</li>
				)
			})
		} else {
			body = <h2>No matches yet</h2>
		}

		return (
			<div>
			<Heading className="text-center" size={1}>Your Matches</Heading>
			<ul className="card_container">
			{body}
			</ul>
			</div>
		)
	}
}

export default compose(
	withRouter,
)(Matches);
