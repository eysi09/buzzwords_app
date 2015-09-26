'use strict';

var Reflux = require('reflux'),
    Actions = require('../actions/actions');

var FilterStores = {};

FilterStores.VisibleFilterItemsStore = Reflux.createStore({
  listenables: Actions,
  onVisibleFilterItemsUpdated: function(visibleItems) {
    this.trigger(visibleItems);
  },
});

FilterStores.SelectedStore = Reflux.createStore({
  listenables: Actions,
  onSelectedCountUpdated: function(selectedCount) {
    this.trigger(selectedCount);
  },
});

module.exports = FilterStores;
