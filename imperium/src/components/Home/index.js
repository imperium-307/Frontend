import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';


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
const INITIAL_STATE = {
  cards: '',
  index: '',
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
          cards: res.users
        });
			})
			.catch(error => {
				this.setState({ error });
			});
	}

  Like = event => {

  };

  Favorite = event => {

  }

  Dislike = event => {

  }
  render (){
    const {cards, index, error} = this.state;
    if (cards == '') {
      return(
        <div style={styles}>
            <button onClick={this.Like}>
            Like
            </button>
            <button onClick={this.Favorite}>
            Favorite
            </button>
            <button onClick={this.Dislike}>
              Dislike
            </button>
        </div>
      );
    }
    else {
    console.log(cards);
    return(
      <div style={styles}>
      {(() => {
        if (cards[0].jobType === "fullTime") {
              cards[0].jobType = "a full time job";
        }
        else if (cards[0].jobType === "internship") {
          cards[0].jobType.jobType = "an internship";
        }
        else {
          cards[0].jobType = " a co-op";
        }
        if (cards[0].persona === "student") {

          return [
            <p1>Name: {cards[0].username}</p1>,
            <br/>,
            <p1>University: {cards[0].university}</p1>,
            <br/>,
            <p1>Major: {cards[0].major}</p1>,
            <br/>,
            <p1>Minor: {cards[0].minor}</p1>,
            <br/>,
            <p1>Bio: {cards[0].bio}</p1>,
            <br/>,
            <p1>Looking for {cards[0].jobType}</p1>,
            <br/>,
            <p1>Start: {cards[0].start} End: {cards[0].end}</p1>,
            <br/>,
            <p1>Prefered Wage: {cards[0].wage}</p1>,
            <br/>,
          ]
        }
        else {
          return[
          <p1>Compnay: {cards[0].company}</p1>,
          <br/>,
          <p1>Major: {cards[0].major}</p1>,
          <br/>,
          <p1>Job Description: {cards[0].bio}</p1>,
          <br/>,
          <p1>Type of job is {cards[0].jobType}</p1>,
          <br/>,
          <p1>Start: {cards[0].start} End: {cards[0].end}</p1>,
          <br/>,
          <p1>Wage: {cards[0].wage}</p1>,
          <br/>,
        ]
        }
        })()}
          <button onClick={this.Like}>
          Like
          </button>
          <button onClick={this.Favorite}>
          Favorite
          </button>
          <button onClick={this.Dislike}>
            Dislike
          </button>
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
