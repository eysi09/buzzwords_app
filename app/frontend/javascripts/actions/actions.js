'use strict';

var Reflux = require('reflux');

var Actions = Reflux.createActions([
  'getInitData',
  'visiblePartyIdsUpdated',
  'visibleFilterItemsUpdated',
  'selectedCountUpdated'
]);

module.exports = Actions;