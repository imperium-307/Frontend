import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';


//TODO make it so you cant click the create posting button without entering all the fields
const JobPostingCreator = () => (
  <div>
    <h1>Job Posting Creator</h1>
    <CreateJobPosting />
  </div>
);
var INITIAL_STATE = {
  jobType: '',
  location: '',
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
	}

  onClick = event => {
    const {
      major, bio, company,location,
      jobType,northeast, west, south, midwest } = this.state;

    fetch("http://localhost:3000/api/user/signup", {
  			body: JSON.stringify({
          bio: bio,
          major: major,
          company: company,
          jobType: jobType,
          northeast: northeast,
          west: west,
          south: south,
          midwest: midwest,
          location: location,
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
					if (res.token) {
              this.props.history.push(ROUTES.COMPANY_HOME);
              localStorage.setItem('token', res.token)
						console.log("signed up and logged in with token" + res.token)
					} else if (res.err) {
						console.log("sign up failed")
						this.setState({ error: res.err });
					}
  			})
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render(){
    const {jobType, location, west, south, midwest, northeast, major, bio, wage} = this.state;
    return(
      <form  onSubmit={this.onClick}>
      <input name="bio" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Job Description"/>
      <br/>
      <input name="location" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Exact Location"/>
      <br/>
      <p1>Please select what reigon that the positon will be in</p1>
      <br/>
      <input name="northeast" value={"northeast"} onChange={this.handleInputChange} type="checkbox"/>
      <p1>Northeast</p1>
      <br/>
      <input name="west" value={"west"} onChange={this.handleInputChange} type="checkbox"/>
      <p1>West</p1>
      <br/>
      <input name="south" value={"south"} onChange={this.handleInputChange} type="checkbox"/>
      <p1>South</p1>
      <br/>
      <input name="midwest" value={"midwest"} onChange={this.handleInputChange} type="checkbox"/>
      <p1>Midwest</p1>
      <br/>
      <br/>
      <input name="major" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Related Major"/>
      <br/>
      <br/>
      <select name="jobType" id="jobType" value={jobType} onChange={this.handleInputChange}>
        <option value="" disabled selected hidden>What type of job are you posting?</option>
        <option value="fullTime">Full Time</option>
        <option value="parttime">Part Time</option>
        <option value="internship">Internship</option>
        <option value="coop">Co-op</option>
      </select>
      <br/>
      <p2>Please enter when the postiton will start and end</p2>
      <br/>
      <input name="start" value={this.state.text} onChange={this.handleInputChange} type="date"/>
      <input name="end" value={this.state.text} onChange={this.handleInputChange} type="date"/>
      <br/>
      <input name="wage" value={this.state.text} onChange={this.handleInputChange} type="number" step=".1" placeholder="Salary of Job"/>
      <br/>
      <button type="submit">
      Create Posting
      </button>
      </form>
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
