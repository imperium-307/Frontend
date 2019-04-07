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

const styles = {
  fontFamily: "arial",
  textAlign: "center",
  marginTop: "40px",
  color: "#421CE8"
};

const HistoryPage = () => (
  <div style={styles}>
  <style>{'body { background-color: #DBDAE1; }'}</style>
    <h1>History</h1>
		<HistoryList />
  </div>
)

var INITIAL_STATE = {
	history: null,
  persona: null,
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
          history: res.history,
          persona: res.persona,
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
      const { history, peronsa } = this.state;
      if (this.state.persona === "student") {
        let body = "You have no history";
        if (this.state.history){
          body = this.state.history.map((d,i) => {
            return (<p>You {this.state.history[i].action}d {this.state.history[i].data} on {this.state.history[i].date}</p>)
          })
        }
        else {
          body = <h1>sad pizza time</h1>
          //should never print
        }
        return (
          <h1>{body}</h1>
        )
      }

    }
  }
}

export default HistoryPage;
