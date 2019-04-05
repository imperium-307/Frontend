import React from 'react';
import './matches.css';
import { Link } from 'react-router-dom';

const styles = {
  fontFamily: "arial",
  textAlign: "center",
  marginTop: "40px",
  color: "#421CE8"
};

const Matches = () => (
  <div style={styles}>
  <style>{'body { background-color: #DBDAE1; }'}</style>
    <h1>Matches</h1>
		<MatchesList />
  </div>
);

class MatchesList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			matches: [],
			persona: ""
		}

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
				var persona = res.persona;
				this.setState({ matches, persona });
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	removeChild = (email) => {
		var matches = this.state.matches
		matches = matches.filter(e => e !== email)
		this.setState({ matches });
	}

	render() {
		let body;
		if (this.state.matches) {
			body = this.state.matches.map((d, i) => {
				return (<Card email={d} removeChild={this.removeChild} />)
			})
		} else {
			body = <h2>No matches yet</h2>
		}

		return (
			<ul className="card_container">
			{body}
			</ul>
		)
	}
}

class Card extends React.Component {
	unmatch = () => {
		fetch("http://localhost:3000/api/user/dislike", {
			body: JSON.stringify({
				token: localStorage.getItem('token'),
				likee: this.props.email
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
				this.props.removeChild(this.props.email);
			})
			.catch(error => {
				this.setState({ error });
			});
	}

  GoToChat = () => {
    //TODO route to chat
	}

	render() {
		const email = this.props.email;

		return (
			<li className="user_details">
			<p>{email}</p>
			<div className="user_contact">
			<button onClick={this.unmatch}>Unmatch</button>
			<button>Chat</button>
			{(() => {
				if (localStorage.getItem('persona') === "student") {

					// TODO this needs lots of work
					// TODO should we add a button to show them the company's profile?
					return (
						<Link to={"/jobs/" + email }>View Posting</Link>
					);
				} else {
					return (
						<Link to={"/view/" + email }>View Profile</Link>
					);
				}
			})()}
			<button onClick={this.GoToChat}>Chat</button>
			</div>
			</li>
		);
	}
}

export default Matches;
