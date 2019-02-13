import React from 'react'

class Forgot extends React.Component{
  render() {
    return (
      <div>
        <h1>Forgot Password</h1>
        <p1>Enter your email from your Imperium Account and we'll send you
        information to get back to your account</p1>
        <form>
          <label>
            Email:
            <br/>
            <input type="text" name="email" />
          </label>
        </form>
        <button>Submit</button>
      </div>
  );

  }
}
export default Forgot
