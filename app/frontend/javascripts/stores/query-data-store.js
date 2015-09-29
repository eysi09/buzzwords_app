var Reflux              = require('reflux'),
    FilterItemsStore    = require('./filter-items-store'),
    Actions             = require('../actions/actions'),
    DataProcessingUtils = require('../utils/data-processing-utils');

var QueryDataStore = Reflux.createStore({

  listenables: Actions,

  selectedGAs:      {},
  selectedParties:  {},
  selectedMps:      {},
  currQueryString:  '', // String used in current query
  prevQueryString:  '', // String used in prev query
  timeseries:       {loaded: false},
  barchart:         {loaded: false},
  
  init: function() {
    this.listenTo(FilterItemsStore, this.grabFilterData);
  },

  // Following are action methods

  onRequestQuery: function(chartKind, trigger, queryString) {
    // First query is always triggered by searchbar,
    // ensuring there is a query string
    // queryString is null when triggered by link click (uses this.currQueryString)
    if (trigger === 'searchbar') {
      this.currQueryString = queryString;
      this.resetChartStates();
    }
    if (this.currQueryString) { // To avoid querying on link click with no previous query
      var queryParams = {
        chartKind:  chartKind,
        queryWords: _.map(this.currQueryString.split(','), function(w) { return w.toLowerCase().trim() }),
        gaids:      _.keys(this.selectedGAs),
        partyids:   _.keys(this.selectedParties),
        mpids:      _.keys(this.selectedMps)
      };
      self = this;
      $.get('/search/query_server', queryParams, function(response) {
        self.updateChartStates(queryParams.chartKind);
        self.handleQueryResponse(response.results, queryParams);
        self.prevQueryString = self.currQueryString;
      });
    }
  },

  onResetQuery: function() {
    this.resetChartStates();
    var emptyData = {chartKind: 'timeseries', results: []};
    this.trigger(emptyData);
    emptyData.chartKind = 'barchart';
    this.trigger(emptyData);
  },

  // Non-action helper methods below

  shouldQuery: function(chartKind) {
    return this.currQueryString && !this[chartKind].loaded;
  },

  resetChartStates: function() {
    this.timeseries.loaded = false;
    this.barchart.loaded = false;
  },

  updateChartStates: function(updatedChartKind) {
    this[updatedChartKind].loaded = true;
  },

  handleQueryResponse: function(results, queryParams) {
    var queryData = {
      chartKind:  queryParams.chartKind,
      timeseries: this.timeseries,
      barchart:   this.barchart
    };
    var qw = queryParams.queryWords;
    var dp = DataProcessingUtils;
    if (queryParams.chartKind === 'timeseries') {
      queryData.results = dp.processTimeseriesData(results, qw, 'party', 'YYYYMMDD');
    } else {
      queryData.results = dp.processBarchartData(results, qw, 'party');
    }
    this.trigger(queryData);
  },

  // Grab and store data from FilterItemsStore for querying
  grabFilterData: function(filterData) {
    this.selectedGAs = filterData.selectedGAs;
    this.selectedParties = filterData.selectedParties;
    this.selectedMps = filterData.selectedMps;
  }

});

module.exports = QueryDataStore;