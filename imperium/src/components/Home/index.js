import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import "./index.css";
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Columns, Content, Image, Heading, Button, Card, Loader, Media } from 'react-bulma-components';

var INITIAL_STATE = {
	cards: null,
	index: 0,
	photoFile: null,
	likee: '',
	isLoading: true,
	error: null,
};

class Home extends Component{
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
		fetch("http://localhost:3000/api/user/request-users", {
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
				if (res.users) {
					this.setState({
						photoFile: res.users[this.state.index].photo,
						cards: res.users,
						isLoading: false,
					});
				} else {
					if (res.err) {
						this.setState({ error: res.err });
					}

					this.setState({ isLoading: false });
				}
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	doAction = (action) => {
		var email = this.state.cards[this.state.index].email
		fetch("http://localhost:3000/api/user/" + action, {
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
				if (res.err) {
					this.setState({ error: res.err });
				} else {
					this.setState(oldState => {
						return {index: oldState.index + 1}
					})
				}
			})
			.catch(error => {
				this.setState({ error });
			});
	}

	render (){
		const {cards, index, photoFile, error} = this.state;
		var hasCards = cards && index < cards.length;

		return (
			<div>
			<Heading className="text-center" size={1}>Home</Heading>
			<div className="flex">
			<Card className="__user_card auto-margin is-centered">
			{(() => {
				if (hasCards) {
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

					if (user.persona == "student") {
						return (
							<Card.Content className="auto-margin">
							<Media className="">
							<Media.Item renderAs="figure" position="left">
							<Image renderAs="p" style={{width:200}} size={200} alt={user.username + "'s profile picture"} src={user.photo} />
							</Media.Item>
							<Media.Item style={{'margin-top': 'auto'}}> 
							<Heading size={3}>{user.username}</Heading>
							<Heading subtitle size={6}>{user.university}</Heading>
							</Media.Item>
							</Media>

							<Content className="">
							<i>{user.bio}</i>
							<br/>
							<a href={"http://localhost:3000/resumes/"+user.email+".pdf"}>View resume</a>
							<br/>
							<br/>

							<span><b>Major:</b> {user.major}</span>
							<br/>
							<span><b>Minor:</b> {user.minor}</span>
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
							</Content>
							</Card.Content>
						);
					} else {
						return (
							<Card.Content className="auto-margin">
							<Media className="">
							<Media.Item renderAs="figure" position="left">
							<Image renderAs="p" style={{width:200}} size={200} alt={user.username + "'s profile picture"} src={user.photo} />
							</Media.Item>
							<Media.Item style={{'margin-top': 'auto'}}> 
							<Heading size={3}>{user.username}</Heading>
							</Media.Item>
							</Media>

							<Content className="">
							<i>{user.bio}</i>
							<br/>
							<a href={"http://localhost:3000/resumes/"+user.email+".pdf"}>View resume</a>
							<br/>

							<br/>
							<span><b>Desired major:</b> {user.major}</span>
							<br/>
							<span><b>Minor:</b> {user.minor}</span>
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

							<br/>
							<div className="buttons is-centered">
							<Button className="is-success is-grouped" onClick={() => {this.doAction("like")}}>
							Like
							</Button>
							<Button className="is-warning is-grouped" onClick={() => {this.doAction("favorite")}}>
							Favorite
							</Button>
							<Button className="is-danger is-grouped" onClick={() => {this.doAction("dislike")}}>
							Dislike
							</Button>
							</div>
							</Content>
							</Card.Content>
						)
					}
				} else if (this.state.isLoading) {
					return (
						<Loader className="auto-margin"
						style={{
							width: 100,
								height: 100,
								border: '4px solid',
								borderTopColor: 'transparent',
								borderRightColor: 'transparent',
						}}
						/>
					)
				} else if(error == null) {
					return <p>There are no profiles available</p>
				}
			})()}

			{error && <p>{error}</p>}
			</Card>
			</div>
			</div>
		)
	}
}

export default compose(
	withRouter,
)(Home);
