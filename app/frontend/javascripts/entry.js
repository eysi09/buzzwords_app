  var React = require('react');
  var _ = require('lodash');
  var App = require ('./components/app');
$(document).ready(function() {
  s = skrollr.init();
  skrollr.menu.init(s, {});
  React.render(<App />, $('#main')[0]);
});
