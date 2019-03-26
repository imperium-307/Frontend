import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
const CompanyHome = () => (
  <div>
    <h1>Company Home</h1>
    <Link to={ROUTES.JOB_POSTING_CREATOR}>Creat a Job Posting</Link>
  </div>
);

export default CompanyHome;
