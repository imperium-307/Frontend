import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Tag, Heading, Button, Footer, Loader, Media } from 'react-bulma-components';
import Popup from "reactjs-popup";
import AddToCalendar from 'react-add-to-calendar';
import * as moment from 'moment-timezone';


var INITIAL_STATE = {
	error: null,
	chatMessage: "",
	lastRefresh: 0,
	title: "",
	description: "",
	location: "",
	startTime: "",
	endTime: "",
	date: "",
	event: "",
	job: null,
	student: null,
	messages: []
};

class ChatPage extends Component{
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };

		fetch(ROUTES.BASE_URL + "/api/user/messages-after" , {
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
					if (el) {
						el.scrollTop = el.scrollHeight;
					}
				}, 25)
			})
			.catch(error => {
				this.setState({ error });
			});

		if (localStorage.getItem("persona") === "student") {
			fetch(ROUTES.BASE_URL + "/api/user/get-job" , {
				body: JSON.stringify({
					token: localStorage.getItem('token'),
					jobid: this.props.match.params.id
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
					if (res.err) {

					} else {
						this.setState({
							job: res
						});
					}
				})
				.catch(error => {
					this.setState({ error });
				});
		} else {
			fetch(ROUTES.BASE_URL + "/api/user/post-view", {
				body: JSON.stringify({
					token: localStorage.getItem('token'),
					email: this.props.match.params.id
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
					if (res.err) {

					} else {
						this.setState({
							student: res
						});
					}
				})
				.catch(error => {
					this.setState({ error });
				});
		}

		this.mesTimer = setInterval(() => {
			fetch(ROUTES.BASE_URL + "/api/user/messages-after" , {
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
							if (el) {
								el.scrollTop = el.scrollHeight;
							}
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
				date: Date.now(),
				isEvent: false,
			}

			var oldMessages = this.state.messages
			oldMessages.push(newMessage);

			this.setState({
				messages: oldMessages,
				chatMessage: ""
			})

			setTimeout(() => {
				var el = document.getElementById("chat-messages");
				if (el) {
					el.scrollTop = el.scrollHeight;
				}
			}, 25)

			fetch(ROUTES.BASE_URL + "/api/user/message" , {
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

	createEvent = () => {
		var eventString = this.state.title + ";" + this.state.description +
			";" + this.state.location + ";" + this.state.date + ";" + this.state.startTime + ";" + this.state.endTime;
		console.log(eventString);
		var newMessage = {
			text: eventString,
			sender: localStorage.getItem('myemail'),
			date: Date.now(),
			isEvent: true,
			etitle: this.state.title,
			edesc: this.state.description,
			eloc: this.state.location,
			estart: this.state.startTime,
			eend: this.state.endTime,
			edate: this.state.date,
		}

		var oldMessages = this.state.messages
		oldMessages.push(newMessage);

		this.setState({
			messages: oldMessages,
			chatMessage: ""
		})

		fetch(ROUTES.BASE_URL + "/api/user/message" , {
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


	render() {
		const { chatMessage, messages, title, description, location, startTime, endTime, date,event, job, student } = this.state;

		return (
			<div>

			<section className="hero" style={{height: "calc(100vh - 40px)"}}>
			<div className="hero-head">
			{(() => {
				if (job) {
					return (
						<div className="text-center" style={{display:"flex", "align-items":"center", "justify-content":"center"}}>
						<img style={{width: 75, height: 75, "margin-right": 16, "border-radius":"100%"}} src={job.photo}/>
						<Heading className="text-center" size={1} style={{display: "inline"}}>Chatting with {job.jobName}</Heading>
						</div>
					)
				} else if (student) {
					return (
						<div className="text-center" style={{display:"flex", "align-items":"center", "justify-content":"center"}}>
						<img style={{width: 75, height: 75, "margin-right": 16, "border-radius":"100%"}} src={student.photo}/>
						<Heading className="text-center" size={1} style={{display: "inline"}}>Chatting with {student.username}</Heading>
						</div>
					)
				}
			})()}
			</div>
			<div id="chat-messages" className="hero-body" style={{"height": 0, "overflow-y": "auto"}}>
			<div style={{ 'width': '100%', 'height': '100%' }}>
			<div className="has-text-centered">
			{(() => {
				if (job) {
					return (
						<i>This is the beginning of your messages with {job.jobName}</i>
					)
				} else if (student) {
					return (
						<i>This is the beginning of your messages with {student.username}</i>
					)
				}
			})()}
			</div>
			{(() => {
				if (messages) {
					return messages.map((d, i) => {
						if (d.sender === localStorage.getItem('myemail')) {
							if (!d.isEvent) {
								return (
									<p style={{ padding: '5px', textAlign: 'right', overflowWrap: 'normal', 'margin-left': '35%' }}>
									<Tag className="is-medium is-info">{d.text}</Tag>
									</p>
								)
							} else {
								var tempStart = d.edate + " " + d.estart;
								var tempEnd = d.edate + " " + d.eend;
								var m1 = moment.tz(tempStart, "America/Toronto")
								var m2 = moment.tz(tempEnd, "America/Toronto")
								console.log(m1);
								this.state.event = {
									title: d.etitle,
									description: d.edesc,
									location: d.eloc,
									startTime: m1,
									endTime: m2,
								}
								return (
									<p style={{ padding: '5px', textAlign: 'right', overflowWrap: 'normal', 'margin-left': '35%' }}>
									<Tag className="is-medium is-info sender-side" style={{height: "100%", paddingTop: 5, paddingBottom: 5}}>
									<AddToCalendar event={this.state.event}/>
									</Tag>
									</p>
								)
							}
						} else {
							if (!d.isEvent){
								return (
									<p style={{ padding: '5px', textAlign: 'left', overflowWrap: 'normal', 'margin-right': '35%'}}>
									<Tag className="is-medium">{d.text}</Tag>
									</p>
								)
							}
							else {
								this.state.event = {
									title: d.etitle,
									description: d.edesc,
									location: d.eloc,
									startTime: d.edate+"T"+d.estart,
									endTime: d.edate+"T"+d.eend,
								}
								return(
									<p style={{ padding: '5px', textAlign: 'left', overflowWrap: 'normal', 'margin-right': '35%'}}>
									<Tag className="is-medium" style={{height: "100%", paddingTop: 5, paddingBottom: 5}}>
									<AddToCalendar event={this.state.event}/>
									</Tag>
									</p>
								)
							}
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
			{ localStorage.getItem('persona') === 'employer' ? (
				<span>
				<a onClick={this.sendMessage} className="button is-info" style={{"border-radius":0}}>Send</a>
				<Popup trigger={<button className="button is-info">📅</button>} modal closeOnDocumentClick>
				<div>Schedule an interview</div>
				<br/>
				<input className="input" onChange={this.onChange} type="text" name="title" placeholder="Title of Event" value={this.state.text}/>
				<br/>
				<input className="input" onChange={this.onChange} type="text" name="description" placeholder="Description of the Event" value={this.state.text}/>
				<br/>
				<input className="input" onChange={this.onChange} type="text" name="location" placeholder="Location of Event" value={this.state.text}/>
				<br/>
				<input className="input" onChange={this.onChange} type="date" name="date" placeholder="Date of Event" value={this.state.text}/>
				<br/>
				<input className="input" onChange={this.onChange} type="time" name="startTime" placeholder="Start Time" value={this.state.text}/>
				<br/>
				<input className="input" onChange={this.onChange} type="time" name="endTime" placeholder="End Time" value={this.state.text}/>
				<br/>
				<button className="button is-info" onClick={this.createEvent}>Create Calendar Event</button>
				</Popup>
				</span>
			) : (
				<a onClick={this.sendMessage} className="button is-info">Send</a>
			)}
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
