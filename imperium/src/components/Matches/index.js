import React from 'react';
import './matches.css';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {
  BrowserRouter as Router,
  Route,
  withRouter,
} from 'react-router-dom';

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
			matches: []
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
				var matches = res.matches
				this.setState({ matches });
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

	viewProfile = () => {

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
			<button onClick={this.GoToChat}>Chat</button>
			<Link to={"/view/" + email }>View profile</Link>
			</div>
			</li>
		);
	}
}

export default Matches;
