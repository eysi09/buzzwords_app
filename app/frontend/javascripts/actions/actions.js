'use strict';

var Reflux = require('reflux');

var Actions = Reflux.createActions([
  'getInitData',      // handled in InitDataStore
  'filterItemClick',  // handled in FilterItemsStore
  'requestQuery',       // handled in QueryDataStore
  'searchbarChange',  // handled in QueryStringStore
  'resetQuery',
  'resetApp'
]);

module.exports = Actions;