import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

var cards = [100];
cards[0] = "hello"

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  marginTop: "40px",
  color: "#421CE8"
};

const Home = () => (
  <div style={styles}>
  <style>{'body { background-color: #878491; }'}</style>
    <h1>Home</h1>
    <GetACard />
  </div>
);
const INITIAL_STATE = {
  username: '',
  email: '',
	bio: '',

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
        console.log(res);
        //cards = res.users;

			})
			.catch(error => {
				this.setState({ error });
			});
	}
  Like = event => {
    console.log(cards[0]);
  };

  Favorite = event => {

  }

  Dislike = event => {

  }

  render (){
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
}

const GetACard = compose (
  withRouter,
)(GetACardBase);

export default Home;

export {GetACard};
