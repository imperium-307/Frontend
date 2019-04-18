import React from 'react';
import { Notification, Columns, Content, Image, Heading, Button, Card, Loader, Media } from 'react-bulma-components';
import { withRouter, Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const Landing = () => (
	<Columns className="is-multiline is-centered">
	<Columns.Column size={8}>
	<div className="custom-card">
	<div className="custom-card__heading-gradient">
	<Heading className="text-center custom-card__heading-text" size={1}>Imperium</Heading>
	</div>
	<div style={{padding: 16}}>
	<br/>
	<Heading className="text-center" size={2}>Our Ethos</Heading>
	<br/>
	<div className="has-text-centered">
	<Heading className="text-center" size={4}>We believe that</Heading>
	<p className="is-centered" style={{"font-size": 20}}>{"{You} "}<strong>while</strong> ¬Employed <strong>do</strong> Imperium <strong>done</strong> {"{You ∧ Employed}"}</p>
	<br/>
	<Heading className="text-center" size={4}>Should always terminate</Heading>
	<br/>
	</div>
	<Heading className="text-center" size={2}>Interested?</Heading>
	<Button className="is-info is-fullwidth is-large" to={ROUTES.SIGN_UP} renderAs={Link} style={{"margin-top":5}}>
	Sign Up
	</Button>
	</div>
	</div>
	</Columns.Column>
	</Columns>
);

export default Landing;
