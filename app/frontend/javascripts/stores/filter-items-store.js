var Reflux        = require('reflux'),
    InitDataStore = require('./init-data-store'),
    Actions       = require('../actions/actions');

var FilterItemsStore = Reflux.createStore({

  listenables: Actions,
  
  gaDataHash:       {},
  partiesMpsHash:   {},
  mpsNameHash:      {},
  selectedGAs:      {},
  selectedParties:  {},
  selectedMps:      {},
  visibleGAIds:     [], // Always stays the same

  init: function() {
    this.listenTo(InitDataStore, this.initDataReceived)
  },

  // Following are action methods

  onFilterItemClick: function(id, selectName) {
    var selectionHolder = {
      gaSelect:     this.selectedGAs,
      partySelect:  this.selectedParties,
      mpSelect:     this.selectedMps
    }[selectName]
    if (selectionHolder[id]) delete selectionHolder[id];
    else selectionHolder[id] = true;
    this.updateVisibleOptions();
  },

  // Non-action helper methods below

  initDataReceived: function(data) {
    this.gaDataHash      = data.gaDataHash;
    this.partiesMpsHash  = data.partiesMpsHash;
    this.mpsNameHash     = data.mpsNameHash;
    this.visibleGAIds    = _.keys(this.gaDataHash).sort().reverse();
    this.trigger({
      visibleGAIds:     this.visibleGAIds,
      visiblePartyIds:  _.keys(this.partiesMpsHash),
      visibleMpIds:     _.keys(this.mpsNameHash),
      selectedGAs:      {},
      selectedParties:  {},
      selectedMps:      {}
    });
  },

  // Þrot
  updateVisibleOptions: function() {
    var selectedGAIds = _.keys(this.selectedGAs);
    var selectedPartyIds = _.keys(this.selectedParties);
    var mpsByGAs = [];
    var mpsByParties = [];

    // Filter by GA selection
    if (selectedGAIds.length > 0) {
      var visiblePartyIds = _.reduce(selectedGAIds, function(memo, id) {
        mpsByGAs = _.uniq(mpsByGAs.concat(this.gaDataHash[id].mp_ids)); // mps come along for the ride
        return _.uniq(memo.concat(this.gaDataHash[id].parties))
      }, [], this);
    } else {
      var visiblePartyIds = _.keys(this.partiesMpsHash);
      var mpsByGAs = _.uniq(_.flatten(_.values(this.partiesMpsHash)));
    }

    // Remove hidden parties from selection
    var selectedParties = this.selectedParties;
    _.each(selectedPartyIds, function(id) {
      if (!_.contains(visiblePartyIds, id)) delete selectedParties[id]
    });
    selectedPartyIds = _.keys(selectedParties);

    // Filter by MP selection
    if (selectedPartyIds.length > 0) {
      var mpsByParties = _.reduce(selectedPartyIds, function(memo, id) {
        return _.uniq(memo.concat(this.partiesMpsHash[id]))
      }, [], this);
      var visibleMpIds = _.intersection(mpsByGAs, mpsByParties);
    } else {
      var visibleMpIds = mpsByGAs;
    }

    // Remove hidden mps from selection
    var selectedMps = this.selectedMps;
    _.each(selectedMps, function(val, key) {
      if (!_.contains(visibleMpIds, parseInt(key))) delete selectedMps[key]
    });

    // Sort
    visiblePartyIds.sort();
    visibleMpIds = _.sortBy(visibleMpIds, function(id) {
      return this.mpsNameHash[id];
    }, this);

    this.trigger({
      visibleGAIds:     this.visibleGAIds,
      visiblePartyIds:  visiblePartyIds,
      visibleMpIds:     visibleMpIds,
      selectedGAs:      this.selectedGAs,
      selectedParties:  this.selectedParties,
      selectedMps:      this.selectedMps
    });
  }

});

module.exports = FilterItemsStore;