var Reflux = require('reflux'),
    Actions = require('../actions/actions');

var InitDataStore = Reflux.createStore({

  listenables: Actions,

  onGetInitData: function() {
    var self = this;
    $.get('/search/init_data', {}, function(response) {
      self.trigger({
        gaDataHash:     response.ga_data_hash,
        partiesMpsHash: response.parties_mps_hash,
        mpsNameHash:    response.mps_name_hash
      });
    });
  },

});

module.exports = InitDataStore;