import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const FavoritePage = () => (
  <div>
    <h1>My Favorites</h1>
  </div>
);

export default FavoritePage;
