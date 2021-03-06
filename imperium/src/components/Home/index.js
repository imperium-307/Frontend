import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import "./index.css";
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Notification, Columns, Content, Image, Heading, Button, Card, Loader, Media } from 'react-bulma-components';

var INITIAL_STATE = {
	cards: null,
	index: 0,
	likee: '',
	isLoading: true,
	favCount: 0,
	error: null,
};

class Home extends Component{
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	componentDidMount = () => {
		var requestURL = ROUTES.BASE_URL + "/api/user";
		if (localStorage.getItem('persona') === "student") {
			requestURL += "/request-jobs";
			fetch(requestURL, {
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
					this.setState({ isLoading: false });
					if (res.err) {
						this.setState({ error: res.err });
						return;
					}

					this.setState({ cards: res.jobs});
				})
				.catch(error => {
					console.log(error)
					this.setState({ error });
				});

			fetch(ROUTES.BASE_URL + "/api/user/post-view", {
				body: JSON.stringify({
					token: localStorage.getItem('token'),
					email: localStorage.getItem('myemail')
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
						if (res.favorites) {
							this.setState({
								favCount: res.favorites.length 
							});
						}
					}
				})
				.catch(error => {
					console.log(error)
					this.setState({ error });
				});
		} else {
			var jobid = this.props.match.params.jobid
			console.log(jobid)

			if (!jobid) {
				this.props.history.push("/companyhome")
			}

			requestURL += "/request-students";
			fetch(requestURL, {
				body: JSON.stringify({
					token: localStorage.getItem('token'),
					jobid: jobid
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
					this.setState({ isLoading: false });
					if (res.err) {
						this.setState({ error: res.err });
						return;
					}

					this.setState({ cards: res.students});
				})
				.catch(error => {
					console.log(error)
					this.setState({ error });
				});
		}
	}

	doAction = (action) => {
		if (action === "favorite") {
			this.setState({ favCount: ++this.state.favCount });
		}
		// iam is the job id, only used when employer is liking a student (as a job)
		var likee, iam;
		if (localStorage.getItem('persona') === "student") {
			likee = this.state.cards[this.state.index].email;
		} else {
			likee = this.state.cards[this.state.index].email
			iam = this.props.match.params.jobid;
		}
		fetch(ROUTES.BASE_URL + "/api/user/" + action, {
			body: JSON.stringify({
				token: localStorage.getItem('token'),
				likee: likee,
				iam: iam
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
					this.setState({ error: res.err });
				} else {
					this.setState(oldState => {
						return {index: oldState.index + 1}
					})
				}
			})
			.catch(error => {
				console.log(error)
				this.setState({ error });
			});
	}

	render (){
		const {cards, index, error, favCount} = this.state;
		var hasCards = cards && index < cards.length;

		var isFavoriteDisabled = false;
			console.log(favCount)
		if (favCount >= 3) {
			isFavoriteDisabled = true;
		}

		return (
			<Columns className="is-multiline is-centered">
			<Columns.Column size={6}>
			<div className="custom-card" >
			<div className="custom-card__heading-gradient">
			<Heading className="text-center custom-card__heading-text" size={1}>Home</Heading>
			</div>
			<br/>
			<div>
			{(() => {
				if (hasCards) {
					// NOTE user is a bad name for this variable, because it can
					// be either a user or a job.
					var user = cards[index]
					var jobType = "";
					switch(user.jobType) {
						case "fullTime":
							jobType = "a full time job";
							break;
						case "internship":
							jobType = "an internship";
							break;
						case "coop":
							jobType = " a co-op";
							break;
						case "parttime":
							jobType = " a part time job"
							break;
					}

					if (user.persona === "student") {
						return (
							<div className="has-text-centered">
							<div className="flex" style={{"justify-content":"center"}}>
							<img style={{width: 200, height: 200, "margin-right": 16, "border-radius":"100%"}} src={user.photo}/>
							{(() => {
								if (user.favorites && this.props && this.props.match && this.props.match.params.jobid && user.favorites.includes(this.props.match.params.jobid)) {
									console.log("here")
									return (
										<div>
										<Heading size={4}>💖</Heading>
										</div>
									)
								}
							})()}
							</div>
							<br/>
							<Heading size={2}>{user.username}</Heading>

							<Button>
							<a target="_blank" href={ROUTES.BASE_URL + "/resumes/"+user.email+".pdf"}>View resume</a>
							</Button>
							<br/>
							<br/>

							<i>{user.bio}</i>
							<br/>

							<br/>
							<span><b>Major:</b> {user.major}</span>
							{ (user.minor !== '' && user.minor !== 'none') ? (
								<span>
								<br/>
								<span><b>Minor:</b> {user.minor}</span>
								</span>
							) : (
								null
							)}
							<br/>
							<span><b>Looking for:</b> {jobType}</span>
							<br/>

							<br/>
							<span><b>Start:</b> {user.start}</span>
							<br/>
							<span><b>End:</b> {user.end}</span>
							<br/>
							<span><b>Desired wage:</b> {user.wage}</span>
							<br/>

							<hr/>
							<div className="buttons is-centered">
							<Button className="is-success is-grouped" onClick={() => {this.doAction("like")}}>
							Like
							</Button>
							<Button className="is-danger is-grouped" onClick={() => {this.doAction("dislike")}}>
							Dislike
							</Button>
							</div>
							</div>
						);
					} else {
						return (
							<div className="has-text-centered">
							<div className="flex" style={{"justify-content":"center"}}>
							<img style={{width: 200, height: 200, "margin-right": 16, "border-radius":"100%"}} src={user.photo}/>
							</div>
							<br/>
							<Heading size={2}>{user.jobName}</Heading>

							<i>{user.bio}</i>

							<br/>
							<br/>
							<span><b>Desired major:</b> {user.major}</span>
							<br/>
							<span><b>Job type:</b> {jobType}</span>
							<br/>

							<br/>
							<span><b>Location:</b> {user.location}</span>
							<br/>
							<span><b>Start:</b> {user.start}</span>
							<br/>
							<span><b>End:</b> {user.end}</span>
							<br/>
							<span><b>Estimated wage:</b> {user.wage}</span>
							<br/>

							<hr/>
							<div className="buttons is-centered">
							<Button className="is-success is-grouped" onClick={() => {this.doAction("like")}}>
							Like
							</Button>
							<Button className="is-warning is-grouped" onClick={() => {this.doAction("favorite")}} disabled={isFavoriteDisabled}>
							Favorite
							</Button>
							<Button className="is-danger is-grouped" onClick={() => {this.doAction("dislike")}}>
							Dislike
							</Button>
							</div>
							</div>
						)
					}
				} else if (this.state.isLoading) {
					return (
						<span>
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
					)
				} else if(error === null || error === "There are no more profiles available, check back later") {
					if (localStorage.getItem('persona') === "student") {
						return (
							<div className="has-text-centered">
							<br/>
							<br/>
							<br/>
							<br/>
							<br/>
							<Heading className="text-center" size={3}>Fresh out of users, check back later!</Heading>
							<Button className="is-info" to={"/matches"} renderAs={Link}>View matches?</Button>
							<br/>
							<br/>
							<br/>
							<br/>
							<br/>
							<br/>
							</div>
						)
					} else {
						return (
							<div className="has-text-centered">
							<br/>
							<br/>
							<br/>
							<br/>
							<br/>
							<Heading className="text-center" size={3}>Fresh out of users, check back later!</Heading>
							<Button className="is-info" to={"/matches/" + this.props.match.params.jobid} renderAs={Link}>View matches?</Button>
							<br/>
							<br/>
							<br/>
							<br/>
							<br/>
							<br/>
							</div>
						)
					}
				}
			})()}
			</div>
			</div>
			</Columns.Column>
			</Columns>
		)
	}
}

export default compose(
	withRouter,
)(Home);
