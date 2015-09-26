require('expose?$!expose?jQuery!jquery');
require('expose?React!expose?React!react');

var	_ 	= require('lodash'),
	App	= require ('./components/app');

React.render(<App />, $('#main')[0]);