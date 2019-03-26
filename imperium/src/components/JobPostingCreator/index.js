import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

const JobPostingCreator = () => (
  <div>
    <h1>Job Posting Creator</h1>
    <CreateJobPosting />
  </div>
);
var INITIAL_STATE = {
  jobType: '',
  Location: '',
  west: '',
  south: '',
  midwest: '',
  northeast: '',
  major: '',
  bio:'',
  wage:'',
};
class CreateJobPosting extends Component {
  constructor(props) {
		super(props);

    this.state = { ...INITIAL_STATE };
		fetch("http://localhost:3000/api/user/signup", {
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

  render(){
    return(
      <div>
      <button type="submit">
      Create Posting
      </button>
      </div>
    )
  }
}

export default JobPostingCreator;



/*
<input name="bio" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Job Description"/>,
            <br/>,
            <input name="location" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Exact Location"/>,
            <br/>,
            <p1>Please select what reigon that the positon will be in</p1>,
            <br/>,
            <input name="northeast" value={"northeast"} onChange={this.handleInputChange} type="checkbox"/>,
            <p1>Northeast</p1>,
            <br/>,
            <input name="west" value={"west"} onChange={this.handleInputChange} type="checkbox"/>,
            <p1>West</p1>,
            <br/>,
            <input name="south" value={"south"} onChange={this.handleInputChange} type="checkbox"/>,
            <p1>South</p1>,
            <br/>,
            <input name="midwest" value={"midwest"} onChange={this.handleInputChange} type="checkbox"/>,
            <p1>Midwest</p1>,
            <br/>,
            <br/>,
            <input name="major" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Related Major"/>,
            <br/>,
            <br/>,
            <select name="jobType" id="jobType" value={jobType} onChange={this.handleInputChange}>
              <option value="" disabled selected hidden>What type of job are you posting?</option>
              <option value="fullTime">Full Time</option>
              <option value="parttime">Part Time</option>
              <option value="internship">Internship</option>
              <option value="coop">Co-op</option>
            </select>,
            <br/>,
            <p2>Please enter when the postiton will start and end</p2>,
            <br/>,
            <input name="start" value={this.state.text} onChange={this.handleInputChange} type="date"/>,
            <input name="end" value={this.state.text} onChange={this.handleInputChange} type="date"/>,
            <br/>,
            <input name="wage" value={this.state.text} onChange={this.handleInputChange} type="number" step=".1" placeholder="Salary of Job"/>,

            */
