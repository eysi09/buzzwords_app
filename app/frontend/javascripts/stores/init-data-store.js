var Reflux  = require('reflux'),
    I       = require('immutable'),
    Actions = require('../actions/actions');

var InitDataStore = Reflux.createStore({

  listenables: Actions,

  onGetInitData: function() {
    var self = this;
    $.get('/search/init_data', {}, function(response) {
      var data = I.Map({
        gaDataHash:     I.fromJS(response.ga_data_hash),
        partiesMpsHash: I.fromJS(response.parties_mps_hash),
        mpsNameHash:    I.fromJS(response.mps_name_hash)
      });
      self.trigger(data);
    });
  },

});

module.exports = InitDataStore;