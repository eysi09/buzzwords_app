//  webpack -d --display-reasons --display-chunks --progress --watch
require('expose?$!expose?jQuery!jquery');
require('expose?React!expose?React!react');
require('expose?skrollr!skrollr');
require('./plugins/skrollr-menu.js');

s = skrollr.init();
skrollr.menu.init(s, {
  updateUrl: true,
  duration: function(currentTop, targetTop) {
    return Math.abs(currentTop - targetTop) * 2;
  }
});

var _   = require('lodash'),
  App = require ('./components/app');

React.render(<App />, $('#main')[0]);