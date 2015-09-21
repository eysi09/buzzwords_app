require('expose?$!expose?jQuery!jquery');
var React = require('react');
var _ = require('lodash');
var App = require ('./components/app');

React.render(<App />, $('#main')[0]);
