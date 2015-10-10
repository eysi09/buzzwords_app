//  webpack -d --display-reasons --display-chunks --progress --watch
require('expose?$!expose?jQuery!jquery');
require('expose?React!react');
require('expose?I!immutable');
require('expose?skrollr!skrollr');
require('./plugins/skrollr-menu.js');

var s = skrollr.init();
skrollr.menu.init(s, {
  updateUrl: true,
  duration: function(currentTop, targetTop) {
    return Math.abs(currentTop - targetTop) * 2;
  }
});

var _   = require('lodash'),
	I 	= require('immutable'),
  	App = require ('./components/app');

React.render(<App />, $('#main')[0]);