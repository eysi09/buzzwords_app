var Reflux = require('reflux'),
    Actions = require('../actions/actions');

var InitDataStore = Reflux.createStore({

  listenables:        Actions,
  gaDataHash:         {},
  partiesMpsHash:     {},
  mpsNameHash:        {},
  initDataRetrieved:  false,

  onGetInitData: function() {
    if (!this.initDataRetrieved) {
      var self = this;
      $.get('/search/init_data', {}, function(response) {
        self.gaDataHash     = response.ga_data_hash;
        self.partiesMpsHash = response.parties_mps_hash;
        self.mpsNameHash    = response.mps_name_hash;
        self.trigger({
          gaDataHash:     self.gaDataHash,
          partiesMpsHash: self.partiesMpsHash,
          mpsNameHash:    self.mpsNameHash
        });
        self.initDataRetrieved = true;
      });
    } else {
      this.trigger({
        gaDataHash:     this.gaDataHash,
        partiesMpsHash: this.partiesMpsHash,
        mpsNameHash:    this.mpsNameHash
      });
    }
  },

});

module.exports = InitDataStore;