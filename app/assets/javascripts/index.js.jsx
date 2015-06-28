$(document).ready(function() {

  var App = React.createClass({
    getInitialState: function() {
      return {
        gaDataHash:           {},
        partiesMpsHash:       {},
        mpsNameHash:          {},
        selectedGAs:          {},
        selectedParties:      {},
        selectedMps:          {},
        visibleGAOpts:        [],
        visiblePartyOpts:     [],
        visibleMpOpts:        [],
        results:              []
      };
    },

    componentDidMount: function() {
      $.get('/search/init_data', {}, function(response) {

        this.setState({
          gaDataHash:     response.ga_data_hash,
          partiesMpsHash: response.parties_mps_hash,
          mpsNameHash:    response.mps_name_hash,
          visibleGAIds:   _.keys(response.ga_data_hash).sort().reverse() // Always stays the same
        });
        this.updateVisibleOptions();
      }.bind(this));
    },

    handleQueryResponse: function(results) {
      this.setState({
        results: results
      })
    },

    toggleOption: function(selectEl, id) {
      var id = selectEl === 'partySelect' ? id : parseInt(id);
      var selectionHolder = {
        gaSelect:     this.state.selectedGAs,
        partySelect:  this.state.selectedParties,
        mpSelect:     this.state.selectedMps
      }[selectEl]
      if (selectionHolder[id]) delete selectionHolder[id];
      else selectionHolder[id] = true;
      this.updateVisibleOptions();
    },

    // Þrot
    updateVisibleOptions: function() {
      var selectedGAIds = _.keys(this.state.selectedGAs);
      var selectedPartyIds = _.keys(this.state.selectedParties);
      var mpsByGAs = [];
      var mpsByParties = [];

      // Filter by GA selection
      if (selectedGAIds.length > 0) {
        var visiblePartyIds = _.reduce(selectedGAIds, function(memo, id) {
          mpsByGAs = _.uniq(mpsByGAs.concat(this.state.gaDataHash[id].mp_ids)); // mps come along for the ride
          return _.uniq(memo.concat(this.state.gaDataHash[id].parties))
        }, [], this);
      } else {
        var visiblePartyIds = _.keys(this.state.partiesMpsHash);
        var mpsByGAs = _.uniq(_.flatten(_.values(this.state.partiesMpsHash)));
      }

      // Remove hidden parties from selection
      var selectedParties = this.state.selectedParties;
      _.each(selectedPartyIds, function(id) {
        if (!_.contains(visiblePartyIds, id)) delete selectedParties[id]
      });
      selectedPartyIds = _.keys(selectedParties);

      // Filter by MP selection
      if (selectedPartyIds.length > 0) {
        var mpsByParties = _.reduce(selectedPartyIds, function(memo, id) {
          return _.uniq(memo.concat(this.state.partiesMpsHash[id]))
        }, [], this);
        var visibleMpIds = _.intersection(mpsByGAs, mpsByParties);
      } else {
        var visibleMpIds = mpsByGAs;
      }

      // Remove hidden mps from selection
      var selectedMps = this.state.selectedMps;
      _.each(selectedMps, function(val, key) {
        if (!_.contains(visibleMpIds, parseInt(key))) delete selectedMps[key]
      });

      // Sort
      visiblePartyIds.sort();
      visibleMpIds = _.sortBy(visibleMpIds, function(id) {
        return this.state.mpsNameHash[id];
      }, this);

      this.setState({
        visiblePartyIds: visiblePartyIds,
        visibleMpIds:    visibleMpIds,
        selectedParties: selectedParties,
        selectedMps:     selectedMps
      });
    },

    // Chart kinds: 
    //  bar
    //    year, 
    //    party, 
    //    mps
    //  timeseries
    //    party (default), 
    //    mp
    handleQuery: function(query_string) {
      if (query_string) {
        var data = {
          query_string:   query_string,
          gaids:          _.keys(this.state.selectedGAs),
          partyids:       _.keys(this.state.selectedParties),
          mpids:          _.keys(this.state.selectedMps),
          chart_kind:     'bar',
          group_by:       'mps'
        };
        self = this;
        $.get('/search/query_server', data, function(response) {
          self.onQueryResponse(response.results);
        });
      } else {
        this.onQueryResponse([]);
      }
    },

    render: function() {
      return <div className="container">
        <Searchbar onQuery={this.handleQuery}/>
        <div className="row filter-wrap">
          <Select onOptionClick={this.toggleOption}
                  name={'gaSelect'}
                  data={{ids: this.state.visibleGAIds, values: this.state.gaDataHash, selection: this.state.selectedGAs}}
                  />
          <Select onOptionClick={this.toggleOption}
                  name={'partySelect'}
                  data={{ids: this.state.visiblePartyIds, values: '', selection: this.state.selectedParties}}
                  />
          <Select onOptionClick={this.toggleOption}
                  name={'mpSelect'}
                  data={{ids: this.state.visibleMpIds, values: this.state.mpsNameHash, selection: this.state.selectedMps}}
                  titleHash={this.state.mpsNameHash}
                  />
        </div>
        <TimeseriesWrap />
        <BarchartWrap />
        <SearchResultsTable results={this.state.results}/>
      </div>
    }
  });

  React.render(<App />, $('#main')[0]);

});