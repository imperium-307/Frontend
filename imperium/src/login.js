import React from 'react'

class Login extends React.Component{
  render() {
    return (
      <div>
        <h1>Login</h1>
        <form>
          <label>
            Username:
            <br/>
            <input type="text" name="username" />
            <br/>
            Password:
            <br/>
            <input type="text" name="password" />
          </label>
        </form>
        <button>Submit</button>
        <button>Create Account</button>
        <br/>
        <a href="https://www.google.com">Forgot Password</a>
      </div>
    );
  }
}
export default Login
