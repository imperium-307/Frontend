import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Login from './login';
import Signup from './signUp';
import Forgot from './forgotPassword';
import MainPage from './mainPage';
import Matches from './matches';
import Settings from './settings';
//import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <div>
    <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
        <Link to="/signUp">Sign Up</Link>
        </li>
        <li>
          <Link to="/forgotPassword">Forgot Password</Link>
        </li>
        <li>
          <Link to="/mainPage">Main Page</Link>
        </li>
        <li>
          <Link to="/matches">Matches</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
      <Route path="/login" component={Login} />
      <Route path="/signUp" component={Signup} />
      <Route path="/forgotPassword" component={Forgot} />
      <Route path="/mainPage" component={MainPage} />
      <Route path="/matches" component={Matches} />
      <Route path="/settings" component={Settings} />
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
