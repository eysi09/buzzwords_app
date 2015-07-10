$(document).ready(function() {

  var App = React.createClass({
    getInitialState: function() {
      return {
        gaDataHash:       {},
        partiesMpsHash:   {},
        mpsNameHash:      {},
        selectedGAs:      {},
        selectedParties:  {},
        selectedMps:      {},
        visibleGAOpts:    [],
        visiblePartyOpts: [],
        visibleMpOpts:    [],
        queryWords:       [],
        results:          null,
        newDataReceived:  false
      };
    },

    componentDidMount: function() {
      $.get('/search/init_data', {}, function(response) {

        this.setState({
          gaDataHash:       response.ga_data_hash,
          partiesMpsHash:   response.parties_mps_hash,
          mpsNameHash:      response.mps_name_hash,
          visibleGAIds:     _.keys(response.ga_data_hash).sort().reverse(), // Always stays the same
          newDataReceived:  false
        });

        this.updateVisibleOptions();
      }.bind(this));
    },

    handleQueryResponse: function(results, query_string, shouldProcess) {
      var queryWords = _.map(query_string.split(','), function(w) { return w.toLowerCase().trim() });
      this.setState({
        results:          results,
        queryWords:       queryWords,
        newDataReceived:  true
      });
    },

    // Borrowed from: http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
    // not in use
    occurrences: function(string, subString, allowOverlapping) {
      string+=""; subString+="";
      if (subString.length<=0) return string.length + 1;
      var n = 0, pos = 0;
      var step = allowOverlapping ? 1 : subString.length;
      while(true) {
        pos = string.indexOf(subString,pos);
        if (pos >= 0) { n++; pos += step; } else break;
      }
      return n;
    },

    toggleOption: function(event) {
      event.stopPropagation();
      var data = event.target.parentNode.dataset;
      var parentSelect = data.parentselect;
      var id = parentSelect === 'partySelect' ? data.id : parseInt(data.id);
      var selectionHolder = {
        gaSelect:     this.state.selectedGAs,
        partySelect:  this.state.selectedParties,
        mpSelect:     this.state.selectedMps
      }[parentSelect]
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
        selectedMps:     selectedMps,
        newDataReceived: false
      });
    },

    handleQuery: function(query_string) {
      if (query_string) {
        var data = {
          query_string:   query_string,
          gaids:          _.keys(this.state.selectedGAs),
          partyids:       _.keys(this.state.selectedParties),
          mpids:          _.keys(this.state.selectedMps),
        };
        self = this;
        $.get('/search/query_server', data, function(response) {
          self.handleQueryResponse(response.results, query_string);
        });
      } else {
        this.handleQueryResponse([]);
      }
    },

    render: function() {
      // <SearchResultsTable data={this.state.results}/>
      // Re-insert below barchartwrap!
      if (this.state.results) {
        var data = {results: this.state.results, queryWords: this.state.queryWords, newDataReceived: this.state.newDataReceived}
        var timeseries = <TimeseriesWrap data={data}/>
        var barchart = <BarchartWrap data={data}/>
      } else {
        var timeseries = '';
        var barchart = '';
      }
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
        {timeseries}
        {barchart}
      </div>
    }
  });

  React.render(<App />, $('#main')[0]);

});