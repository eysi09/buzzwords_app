var Reflux        = require('reflux'),
    I             = require('immutable'),
    InitDataStore = require('./init-data-store'),
    Actions       = require('../actions/actions');

var FilterItemsStore = Reflux.createStore({

  listenables: Actions,
  
  gaDataHash:       I.Map(),
  partiesMpsHash:   I.Map(),
  mpsNameHash:      I.Map(),
  selectedGAs:      I.Map(),
  selectedParties:  I.Map(),
  selectedMps:      I.Map(),
  visibleGAIds:     I.Set(), // Always stays the same

  init: function() {
    this.listenTo(InitDataStore, this.initDataReceived);
  },

  // Following are action methods

  onUpdateSelectedGAs: function(id) {
    if (this.selectedGAs.get(id)) { this.selectedGAs = this.selectedGAs.delete(id); }
    else this.selectedGAs = this.selectedGAs.set(id, true);
    //this.selectedGAs = this.selectedGAs.update(id, v => !v);
    this.updateVisibleOptions();
  },

  onUpdateSelectedParties: function(id) {
    if (this.selectedParties.get(id)) { this.selectedParties = this.selectedParties.delete(id); }
    else this.selectedParties = this.selectedParties.set(id, true);
    //this.selectedParties = this.selectedParties.update(id, v => !v);
    this.updateVisibleOptions();
  },

  onUpdateSelectedMps: function(id) {
    if (this.selectedMps.get(id)) { this.selectedMps = this.selectedMps.delete(id); }
    else this.selectedMps = this.selectedMps.set(id, true);
    //this.selectedMps = this.selectedMps.update(id, v => !v);
    this.updateVisibleOptions();
  },

  // Non-action helper methods below

  initDataReceived: function(data) {
    this.gaDataHash      = data.get('gaDataHash');
    this.partiesMpsHash  = data.get('partiesMpsHash');
    this.mpsNameHash     = data.get('mpsNameHash');
    this.visibleGAIds    = this.gaDataHash.keySeq().map(v => parseInt(v)).sort().reverse().toSet();
    this.trigger(I.fromJS({
      visibleGAIds:     this.visibleGAIds,
      visiblePartyIds:  this.partiesMpsHash.keySeq().toSet(), // already ordered
      visibleMpIds:     this.mpsNameHash.keySeq().toSet(), // already ordered
      selectedGAs:      I.Map(),
      selectedParties:  I.Map(),
      selectedMps:      I.Map()
    }));
  },

  // Þrot
  updateVisibleOptions: function() {
    var mpsByGAs = I.Set();
    var mpsByParties = I.Set();
    var visiblePartyIds = I.Set();
    var visibleMpIds = I.Set();

    // Filter parties and mps by gas
    if (this.selectedGAs.size > 0) {
      this.selectedGAs.forEach((value, id) => {
        mpsByGAs = mpsByGAs.add(this.gaDataHash.getIn([String(id), 'mp_ids'])).flatten(true);
        visiblePartyIds = visiblePartyIds.add(this.gaDataHash.getIn([String(id), 'parties'])).flatten(true);
      });
    } else {
      visiblePartyIds = this.partiesMpsHash.keySeq().toSet();
      mpsByGAs = this.partiesMpsHash.valueSeq().flatten(true).toSet();
    }
    // Remove hidden parties from selection
    this.selectedParties = this.selectedParties.keySeq()
      .toSet().intersect(visiblePartyIds) // set of ids that are selected and visible
      .toMap().map(id => true);

    // Filter mps by parties
    if (this.selectedParties.size > 0) {
      this.selectedParties.forEach((value, id) => {
        mpsByParties = mpsByParties.add(this.partiesMpsHash.get(id)).flatten(true);
      });
      visibleMpIds = mpsByGAs.intersect(mpsByParties);
    } else {
      visibleMpIds = mpsByGAs;
    }

    this.selectedMps = this.selectedMps.keySeq()
      .toSet().map(id => parseInt(id)).intersect(visibleMpIds) // set of ids that are selected and visible
      .toMap().map(id => true);

    // Sort
    visiblePartyIds = visiblePartyIds.sort();
    visibleMpIds = visibleMpIds.sortBy(id => {
      return this.mpsNameHash.get(id)
    });

    this.trigger(I.fromJS({
      visibleGAIds:     this.visibleGAIds,
      visiblePartyIds:  visiblePartyIds,
      visibleMpIds:     visibleMpIds,
      selectedGAs:      this.selectedGAs,
      selectedParties:  this.selectedParties,
      selectedMps:      this.selectedMps
    }));
  }

});

module.exports = FilterItemsStore;