'use strict';

var Reflux = require('reflux');

var Actions = Reflux.createActions([
  'getInitData',          	// handled in InitDataStore
  'updateSelectedGAs',    	// handled in FilterItemsStore
  'updateSelectedParties',  // handled in FilterItemsStore
  'updateSelectedMps',      // handled in FilterItemsStore
  'chartSettingsChange',  	// handled in QueryDataStore
  'requestQuery',         	// handled in QueryDataStore
  'resetQuery',           	// handled in QueryDataStore
  'resetApp'              	// TODO
]);

module.exports = Actions;