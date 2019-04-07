import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

//Routing might be broken
// const HistoryPage = () => (
//   <div>
//     <h1>History</h1>
//     <HistoryList />
//   </div>
// );
var INITIAL_STATE = {
	history: null,
	error: null,
};

class HistoryList extends Component{
  constructor(props){
    super(props);
    this.state = { ...INITIAL_STATE };

    fetch("http://localhost:3000/api/user", {
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
          history: res.history
        });
			})
			.catch(error => {
				this.setState({ error });
			});
  }


  render(){
    console.log(this.state.history);
    if (!this.state || !this.state.history) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }
    else{
      const { history } = this.state;
      if (this.state.history) {
        console.log(this.state.history[0].date);
      }
      return (
        <div>
          <h1>history time</h1>
        </div>
      )
    }
  }
}
const History = compose (
  withRouter,
)(HistoryList);

export default History;
