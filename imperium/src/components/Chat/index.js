import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Tag, Heading, Button, Footer, Loader, Media } from 'react-bulma-components';

var my_email = "student"
var their_email = "them@them.com"
var test_chat = {
	messages: [
		{
			text: "message the first",
			sender: their_email,
			date: Date.now()
		},
		{
			text: "message the second",
			sender: my_email,
			date: Date.now()
		},
		{
			text: "message the third",
			sender: their_email,
			date: Date.now()
		},
		{
			text: "message the first",
			sender: their_email,
			date: Date.now()
		},
		{
			text: "message the second",
			sender: my_email,
			date: Date.now()
		},
		{
			text: "message the third",
			sender: their_email,
			date: Date.now()
		},
		{
			text: "message the first",
			sender: their_email,
			date: Date.now()
		},
		{
			text: "message the second",
			sender: my_email,
			date: Date.now()
		},
		{
			text: "message the third",
			sender: their_email,
			date: Date.now()
		},
		{
			text: "message the first",
			sender: their_email,
			date: Date.now()
		},
		{
			text: "message the second",
			sender: my_email,
			date: Date.now()
		},
		{
			text: "message the third",
			sender: their_email,
			date: Date.now()
		}
	]
}

var INITIAL_STATE = {
	error: null,
	chatMessage: "",
	lastRefresh: 0,
	messages: test_chat.messages
};

class ChatPage extends Component{
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };

		// TODO set get chat endpoint
		// TODO set body as needed by backend
		fetch("http://localhost:3000/api/user/messages-since" , {
			body: JSON.stringify({
				token: localStorage.getItem('token'),
				since: this.state.lastRefresh
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
				console.log(res)
				if (res.err) {
					this.setState({ error: res.err });
				} else {
					// TODO set messages we recieved
					setTimeout(() => {
						var el = document.getElementById("chat-messages");
						el.scrollTop = el.scrollHeight;
					}, 25)
				}
			})
			.catch(error => {
				console.log(error)
				this.setState({ error });
			});

		setInterval(() => {
			// TODO set body as needed by backend
			fetch("http://localhost:3000/api/user/messages-since" , {
				body: JSON.stringify({
					token: localStorage.getItem('token'),
					since: this.state.lastRefresh
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
					console.log(res)
					if (res.err) {
						this.setState({ error: res.err });
					} else {
						console.log(res)
					}
				})
				.catch(error => {
					console.log(error)
					this.setState({ error });
				});
		}, 30000);

	}

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	sendMessage = () => {
		if (this.state.chatMessage != "") {
			var newMessage = {
				text: this.state.chatMessage, 
				sender: localStorage.getItem('myemail'), 
				date: Date.now()
			}

			var oldMessages = this.state.messages
			oldMessages.push(newMessage);

			this.setState({
				messages: oldMessages,
				chatMessage: ""
			})

			// TODO actually send message, depending on what backend does
		}
	}

	render() {
		const { chatMessage, messages } = this.state;

		return (
			<div>

			<section className="hero" style={{height: "calc(100vh - 40px)"}}>
			<div className="hero-head">
			<Heading className="text-center" size={1}>Chat</Heading>
			</div>
			<div id="chat-messages" className="hero-body" style={{"height": 0, "overflow-y": "auto"}}>
			<div style={{ 'width': '100%', 'height': '100%' }}>
			{messages.map((d, i) => {
				if (d.sender === localStorage.getItem('myemail')) {
					return (
						<p style={{ padding: '5px', textAlign: 'right', overflowWrap: 'normal', 'margin-left': '35%' }}>
						<Tag className="is-medium is-info">{d.text}</Tag>
						</p>
					)
				} else {
					return (
						<p style={{ padding: '5px', textAlign: 'left', overflowWrap: 'normal', 'margin-right': '35%'}}>
						<Tag className="is-medium">{d.text}</Tag>
						</p>
					)
				}
			})}
			</div>
			</div>

			<div className="hero-foot">
			<div className="section is-small">
			<div className="is-fluid field has-addons" style={{'margin-right': '80px'}}>
			<div className="control is-expanded">
			<input className="input" onChange={this.onChange} type="text" name="chatMessage" placeholder="Type a message..." value={chatMessage}/>
			</div>
			<div className="control">
			<a onClick={this.sendMessage} className="button is-info">Send</a>
			</div>
			</div>
			</div>
			</div>
			</section>

			</div>
		)
	}
}

export default compose(
	withRouter,
)(ChatPage);
