var Reflux  = require('reflux'),
    Actions = require('../actions/actions');

var QueryStringStore = Reflux.createStore({

  listenables: Actions,

  onSearchbarChange: function(queryString) {
    this.trigger(queryString);
  },

});

module.exports = QueryStringStore;