import React from 'react';
import './matches.css';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Columns, Button, Heading } from 'react-bulma-components';

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
					this.setState({ 
						matches: res.matchesObject
					});
				})
				.catch(error => {
					this.setState({ error });
				});

		} else {
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
						matches: res.matchesObject
					});
				})
				.catch(error => {
					this.setState({ error });
				});
		}
	}

	removeChild = (email) => {
		var matches = this.state.matches
		matches = matches.filter(e => e.email !== email)
		this.setState({ matches });
	}

	unmatch = (email) => {
		fetch("http://localhost:3000/api/user/unmatch", {
			body: JSON.stringify({
				token: localStorage.getItem('token'),
				iam: this.props.match.params.jobid,
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
				this.removeChild(email);
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	GoToChat = (email) => {
		if (localStorage.getItem('persona') === "student") {
			this.props.history.push("/chat/" + email);
		} else {
			this.props.history.push("/chat/" + email + "/from/" + this.props.match.params.jobid);
		}
	}

	render() {
		return (
			<Columns className="is-multiline is-centered">
			<Columns.Column size={8}>
			<div className="custom-card" >
			<div className="custom-card__heading-gradient">
			<Heading className="text-center custom-card__heading-text" size={1}>Your Matches</Heading>
			</div>
			<br/>
			<div>
			{(() => {
				if (this.state.matches && this.state.matches.length > 0) {
					return this.state.matches.map((d, i) => {
						var bgcolor = "#fff";
						if (i%2 !== 0) {
							bgcolor = "#f5f5f5";
						}

						return (
							<div className="flex" style={{padding: 16, "justify-content": "space-between", "background-color": bgcolor}}>
							<div style={{display: "inherit"}}>
							<img style={{width: 50, height: 50}} src={d.photo}/>
							<span className="flex" style={{"align-items": "center", "padding-left": 10}}>{d.name}</span>
							</div>
							<div className="buttons has-addons">
							<Button onClick={() => {this.unmatch(d.email)}}>Unmatch</Button>
							<Button onClick={() => {this.GoToChat(d.email)}}>Chat</Button>
							{(() => {
								if (localStorage.getItem('persona') === "student") {
									return (
										<Button to={"/jobs/" + d.email } renderAs={Link}>View</Button>
									);
								} else {
									return (
										<Button to={"/view/" + d.email } renderAs={Link}>View</Button>
									);
								}
							})()}
							</div>
							</div>
						)
					})
				} else {

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
)(Matches);
