import React from 'react'

class Sign extends React.Component{
  render() {
    return (
      <div>
        <h1>Sign Up</h1>
        <p1>Please fill out all fields with your information</p1>
        <form>
          <label>
            Name:
            <br/>
            <input type="text" name="name" />
            <br/>
            Email:
            <br/>
            <input type="text" name="email" />
            <br/>
            Birthday (mm/dd/yyyy):
            <br/>
            <input type="text" name="bd" />
            <br/>
            Phone Number:
            <br/>
            <input type="text" name="phoneNumber" />
            <br/>
            Major:
            <br/>
            <input type="text" name="major" />
            <br/>
            Elevator Pitch:
            <br/>
            <input type="text" name="elavator" />
            <br/>
          </label>
        </form>
        <button>Submit</button>
      </div>
    );
  }
}
export default Sign
