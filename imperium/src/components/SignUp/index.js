import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import './Button.css';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
var pdf = false;
var jpeg = false;
var sub = true;
const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  marginTop: "40px",
  color: "#421CE8"
};
const buttonStyle = {
	fontSize: 20,
	fontWeight: '400',
	color: "#fff",
	backgroundColor: "#421CE8",
	paddingHorizontal: 30,
	paddingVertical: 5,
	borderRadius: 30
};

const SignUpPage = () => (
  <div style={styles}>
  <style>{'body { background-color: #878491; }'}</style>
    <h1>Sign Up</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  persona: '',
  bio: '',
  major: '',
  minor: '',
  university: '',
  company: '',
  resume: '',
	resumeFile: null,
  photo: '',
  photoFile: null,
  jobType: '',
  start: '',
  end: '',
  wage: '',
  northeast: '',
  south: '',
  west: '',
  midwest: '',
  radius: '',
  error: null

};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onSubmit = event => {
    const { username, email, passwordOne, passwordTwo, persona, university,
      major, bio, company, criteria, resumeFile, photoFile,
      jobType, start, end, wage, minor, northeast, west, south, midwest } = this.state;

		const data = new FormData();
		data.append('file', resumeFile);

		fetch('http://localhost:3000/api/user/ch-resume/' + email, {
			method: 'POST',
			body: data,
		})

    fetch("http://localhost:3000/api/user/signup", {
  			body: JSON.stringify({
          username: username,
  				email: email,
  				password: passwordOne,
          passwordConfirm: passwordTwo,
          persona: persona,
          bio: bio,
          university: university,
          major: major,
          minor: minor,
          company: company,
          criteria: criteria,
          photo: photoFile,
          jobType: jobType,
          start: start,
          end: end,
          wage: wage,
          northeast: northeast,
          west: west,
          south: south,
          midwest: midwest,
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
            if (persona == "student"){
              this.props.history.push(ROUTES.HOME);
              localStorage.setItem('token', res.token)
            }
            else if (persona == "employer") {
              this.props.history.push(ROUTES.HOME);
              localStorage.setItem('token', res.token)
            }
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

  onChange = event => {
    this.setState({value: event.target.value});
    //this.setState({ [event.target.name]: event.target.value });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

		if (target.name == "resume") {
			this.setState({
				["resumeFile"]: target.files[0]
			});
		}

		if (target.name == "photo") {
			var f = target.files[0];
			var r = new FileReader();
			r.onloadend = ()=> {
				this.setState({
					["photoFile"]: r.result
				});
			}
			r.readAsDataURL(f);
		}

		this.setState({
			[name]: value
		});
  }


  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      persona,
      bio,
      university,
      major,
      company,
      criteria,
      resume,
      photo,
      jobType,
      start,
      end,
      wage,
      minor,
      northeast,
      west,
      south,
      midwest,
      radius,
      error
    } = this.state;
//TODO check if new sign up options are empty
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';


    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.handleInputChange}
          type="text"
          placeholder="Full Name"
        />
        <br/>
        <input
          name="email"
          value={email}
          onChange={this.handleInputChange}
          type="text"
          placeholder="Email Address"
        />
        <br/>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.handleInputChange}
          type="password"
          placeholder="Password"
        />
        <br/>
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.handleInputChange}
          type="password"
          placeholder="Confirm Password"
        />
        <br/>
        <select name="persona" id="persona" value={persona} onChange={this.handleInputChange}>
          <option value="" disabled selected hidden>Who are you?</option>
          <option value="student">Student</option>
          <option value="employer">Employer</option>
        </select>
        <br/>
        <br/>
        <div>
        {(() => {
        switch (persona) {
          case "student":   return [
            <input name="university" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="University"/>,
            <br/>,
            <input name="major" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Major"/>,
            <br/>,
            <p1>*if mulitple majors please seperate with a ","</p1>,
            <br/>,
            <input name="minor" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Minor"/>,
            <br/>,
            <p1>*if mulitple minors please seperate with a ","</p1>,
            <br/>,
            <input name="bio" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Bio"/>,
            <br/>,
            <p1>Please select what reigons you would be interested in working on</p1>,
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
            <p1>Upload your resume as a .pdf</p1>,
            <br/>,
            <input type="file" value={resume} name="resume" id="resume" onChange={this.handleInputChange} placeholder="Resume Upload" />,
            <br/>,
            <p1>Please upload a photo of yourself as a .PNG</p1>,
            <br/>,
            <input type="file" value={photo} name="photo" id="photo" onChange={this.handleInputChange}/>,
            <br/>,
            <select name="jobType" id="jobType" value={jobType} onChange={this.handleInputChange}>
              <option value="" disabled selected hidden>What type of job are you looking for?</option>
              <option value="fullTime">Full Time</option>
              <option value="internship">Internship</option>
              <option value="coop">Co-op</option>
            </select>,
            <br/>,
            <p2>Please enter which days you will be able start and end</p2>,
            <br/>,
            <input name="start" value={this.state.text} onChange={this.handleInputChange} type="date"/>,
            <input name="end" value={this.state.text} onChange={this.handleInputChange} type="date"/>,
            <br/>,
            <input name="wage" value={this.state.text} onChange={this.handleInputChange} type="number" step=".1" placeholder="Desired Wage"/>,



          ]

          case "employer": return [
            <input name="company" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Company"/>,
            <br/>,
            <input name="bio" value={this.state.text} onChange={this.handleInputChange} type="text" placeholder="Job Description"/>,
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
            <p1>Please upload a photo of your company as a .PNG</p1>,
            <br/>,
            <input type="file" value={photo} name="photo" id="photo" onChange={this.handleInputChange} />,
            <br/>,
            <select name="jobType" id="jobType" value={jobType} onChange={this.handleInputChange}>
              <option value="" disabled selected hidden>What type of job are you posting?</option>
              <option value="fullTime">Full Time</option>
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



          ]
                  }
      })()}

      {(() => {
        var rString = resume.substring(resume.length-4, resume.length);
        if (rString === ".pdf"){
          pdf = true;
        }
        else {
          pdf = false;
        }
        var pString = photo.substring(photo.length-4, photo.length);
        if (pString.toLowerCase() === ".png"){
          jpeg = true;
        }
        else {
          jpeg = false;
        }
      })()}

      {(() => {
        if (jpeg){
          if(!isInvalid){
            if (persona === "employer" || pdf) {
              sub = false;
            }
            else {
              sub = true;
            }
          }
          else {
            sub = true;
          }
        }
        else {
          sub = true;
        }
      })()}

      {(() => {
        console.log(minor);
        console.log(bio);

          if (persona === "student"){
              if (major === '' || university === '' || minor === '' || bio === '' || jobType === '' || start === '' || end === '' || wage === '') {
                  sub = true;
              }
              else {
                if (sub === false){
                  sub = false;
                }
              }
          }
          else if (persona === "employer") {
            if (major === '' || company === '' || bio === '' || jobType === '' || start === '' || end === '' || wage === '') {
                sub = true;
            }
            else {
              if (sub === false){
                sub = false;
              }
            }
          }
          else {
            sub = true;
          }
      })()}

        </div>
        <br/>
        <button style={buttonStyle} disabled={sub} type="submit">
          Sign Up
        </button>

        {error && <p>{error}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
