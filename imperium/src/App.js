import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
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
        <a href="https://www.google.com">Forgot Password?</a>
        </header>
      </div>
    );
  }
}

export default App;
