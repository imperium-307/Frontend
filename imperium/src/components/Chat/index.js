import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Tag, Heading, Button, Footer, Loader, Media } from 'react-bulma-components';

var INITIAL_STATE = {
	error: null,
	chatMessage: "",
	lastRefresh: 0,
	messages: []
};

class ChatPage extends Component{
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };

		console.log( this.props.match.params.jobid, this.props.match.params.id)

		fetch("http://localhost:3000/api/user/messages-after" , {
			body: JSON.stringify({
				token: localStorage.getItem('token'),
				after: this.state.lastRefresh,
				iam: this.props.match.params.jobid,
				recipient: this.props.match.params.id
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
				if (res.messages) {
					this.setState({
						messages: res.messages
					});
				} else if (res.err) {
					this.setState({ 
						error: res.err,
						lastRefresh: 1
					});
				} else {
					this.setState({ 
						lastRefresh: 1
					});
				}

				setTimeout(() => {
					var el = document.getElementById("chat-messages");
					el.scrollTop = el.scrollHeight;
				}, 25)
			})
			.catch(error => {
				this.setState({ error });
			});

		this.mesTimer = setInterval(() => {
			fetch("http://localhost:3000/api/user/messages-after" , {
				body: JSON.stringify({
					token: localStorage.getItem('token'),
					after: this.state.lastRefresh,
					iam: this.props.match.params.jobid,
					recipient: this.props.match.params.id
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
					if (res.messages) {
						this.setState({
							lastRefresh: Date.now(),
							messages: res.messages
						});

						setTimeout(() => {
							var el = document.getElementById("chat-messages");
							el.scrollTop = el.scrollHeight;
						}, 25)
					} else if (res.err) {
						this.setState({ error: res.err });
					}
				})
				.catch(error => {
					this.setState({ error });
				});
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.mesTimer);
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

			setTimeout(() => {
				var el = document.getElementById("chat-messages");
				el.scrollTop = el.scrollHeight;
			}, 25)

			fetch("http://localhost:3000/api/user/message" , {
				body: JSON.stringify({
					token: localStorage.getItem('token'),
					message: newMessage,
					iam: this.props.match.params.jobid,
					recipient: this.props.match.params.id
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
			{(() => {
				if (messages) {
					return messages.map((d, i) => {
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
					})
				} else {
					return <p style={{ padding: '5px', textAlign: 'center', overflowWrap: 'normal'}}>You have no messages yet</p>
				}
			})()}
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
