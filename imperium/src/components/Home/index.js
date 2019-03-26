import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import "./index.css";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  marginTop: "40px",
  color: "#421CE8"
};

const Home = () => (
  <div style={styles}>
  <style>{'body { background-color: #DBDAE1; }'}</style>
    <h1>Home</h1>
    <GetACard />
  </div>
);
var INITIAL_STATE = {
  cards: null,
  index: 0,
  photoFile: null,
  resumeFile: null,
  likee: '',
  error: null,
};

class GetACardBase extends Component{
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
        this.setState({
          photoFile: res.users[this.state.index].photo,
          cards: res.users,
        });
			})
			.catch(error => {
				this.setState({ error });
			});
	}

  Like = (email) => {
    var temp = this.state.index;
		console.log(email)
    fetch("http://localhost:3000/api/user/like", {
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
          console.log(res);
			})
			.catch(error => {
				this.setState({ error });
			});

    temp++;
    this.setState({
      index: temp
    })
  };

  Favorite = email => {
    var temp = this.state.index;
		console.log(email)
    fetch("http://localhost:3000/api/user/favorite", {
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
					temp++;
					this.setState({
						index: temp
					})
				}
			})
			.catch(error => {
				this.setState({ error });
			});

	}

	Dislike = email => {
		var temp = this.state.index;
		console.log(email)
		fetch("http://localhost:3000/api/user/like", {
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
				console.log(res);
			})
			.catch(error => {
				this.setState({ error });
			});

		temp++;
		this.setState({
			index: temp
		})
	}
	render (){
		var check = false;
		if (this.state && this.state.cards){
			if (this.state.index >= this.state.cards.length) {
				check = true;
			}
		}
		if (!this.state || !this.state.cards || check) {
			return(
				<div>
				<p1>There are no profiles available</p1>
				</div>
			);
		} else {
			const {cards, index, photoFile, error} = this.state;
			return(
				<div style={styles}>
				{(() => {

					if (cards[index].jobType === "fullTime") {
						cards[index].jobType = "a full time job";
					}
					else if (cards[index].jobType === "internship") {
						cards[index].jobType = "an internship";
					}
					else {
						cards[index].jobType = " a co-op";
					}
					if (cards[index].persona === "student") {

						return [
							<img id="photoData" src= { cards[index].photo }/>,
							<br/>,
							<p1>Name: {cards[index].username}</p1>,
							<br/>,
							<p1>University: {cards[index].university}</p1>,
							<br/>,
							<p1>Major: {cards[index].major}</p1>,
							<br/>,
							<p1>Minor: {cards[index].minor}</p1>,
							<br/>,
							<p1>Bio: {cards[index].bio}</p1>,
							<br/>,
							<a href={"http://localhost:3000/resumes/"+cards[index].email+".pdf"}>View your current resume</a>,
							<br/>,
							<p1>Looking for {cards[index].jobType}</p1>,
							<br/>,
							<p1>Start: {cards[index].start} End: {cards[index].end}</p1>,
							<br/>,
							<p1>Prefered Wage: {cards[index].wage}</p1>,
							<br/>,
						]
					}
					else {
						return[
							<img id="photoData" src= { cards[index].photo }/>,
							<br/>,
							<p1>Company: {cards[index].company}</p1>,
							<br/>,
							<p1>Major: {cards[index].major}</p1>,
							<br/>,
							<p1>Job Description: {cards[index].bio}</p1>,
							<br/>,
							<p1>Type of job is {cards[index].jobType}</p1>,
							<br/>,
							<p1>Location: {cards[index].location}</p1>,
							<br/>,
							<p1>Start: {cards[index].start} End: {cards[index].end}</p1>,
							<br/>,
							<p1>Wage: {cards[index].wage}</p1>,
							<br/>,
						]
					}
				})()}
				{(() => {
					if (cards[index].persona === "employer"){
						return [
							<button onClick={() => {this.Like(cards[index].email) }}>
							Like
							</button>,
							<button onClick={() => {this.Favorite(cards[index].email)}}>
							Favorite
							</button>,
							<button onClick={() => {this.Dislike(cards[index].email) }}>
							Dislike
							</button>,
						]
					}
					else {
						return [
							<button onClick={() => {this.Like(cards[index].email) }}>
							Like
							</button>,
							<button onClick={() => {this.Dislike(cards[index].email) }}>
							Dislike
							</button>,
						]
					}
				})()}
        {error && <p>{error}</p>}
				</div>
			);
		}
	}
}

const GetACard = compose (
	withRouter,
)(GetACardBase);

export default Home;

export {GetACard};
