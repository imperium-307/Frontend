import React from "react";
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

function logout() {
	localStorage.removeItem('token')
}

export default ({ close }) => (
  <div className="menu">
    <ul>
      <li onClick={close}>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li onClick={close}>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li onClick={close}>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li onClick={close}>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li onClick={close}>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
      <li onClick={close}>
        <Link to={ROUTES.MATCHES}>Matches</Link>
      </li>
      <li onClick={close}>
        <Link onClick={logout} to={ROUTES.LANDING}>Sign Out</Link>
      </li>
    </ul>
  </div>
);
