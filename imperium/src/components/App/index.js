import React from 'react';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import ViewPage from '../View';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import MatchesPage from '../Matches';
import CompanyHome from '../CompanyHome';
import JobPostingCreatorPage from '../JobPostingCreator';
import HistoryPage from '../History';
import ChatPage from '../Chat';
import EditJobPage from '../EditJob';
import FavoritePage from '../Favorite';
import * as ROUTES from '../../constants/routes';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Navigation from '../Navigation';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.HOME_WITH_JOB_ID} component={HomePage} />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route exact path={ROUTES.MATCHES} component={MatchesPage} />
      <Route path={ROUTES.MATCHES_WITH_JOBID} component={MatchesPage} />
      <Route path={ROUTES.VIEW} component={ViewPage} />
      <Route path={ROUTES.JOB_POSTING_CREATOR} component={JobPostingCreatorPage} />
      <Route path={ROUTES.COMPANY_HOME} component={CompanyHome} />
      <Route path={ROUTES.EDIT_JOB} component={EditJobPage} />
      <Route exact path={ROUTES.HISTORY} component={HistoryPage} />
      <Route path={ROUTES.HISTORY_WITH_JOB_ID} component={HistoryPage} />
      <Route path={ROUTES.FAVORITE} component={FavoritePage} />
      <Route exact path={ROUTES.CHAT} component={ChatPage} />
      <Route path={ROUTES.CHAT_WITH_JOB_ID} component={ChatPage} />
    </div>
  </Router>
);

export default App;
