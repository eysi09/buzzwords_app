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
  timeseries:       {loaded: false, dateGran: 'week', groupBy: 'word'},
  barchart:         {loaded: false, groupBy: 'word'},
  
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
    this.query(chartKind);
  },

  onResetQuery: function() {
    this.resetChartStates();
    var pubData = this.defaultPublishData();
    pubData.results = [];
    pubData.chartKind = 'timeseries';
    this.trigger(pubData);
    emptyData.chartKind = 'barchart';
    this.trigger(pubData);
  },

  onChartSettingsChange: function(chartKind, settingKey, setting) {
    this[chartKind][settingKey] = setting;
    this.query(chartKind);
  },

  // Non-action helper methods below

  query: function(chartKind) {
    if (this.currQueryString) { // To avoid querying on link click with no previous query
      var queryWords = _.map(this.currQueryString.split(','), function(w) { return w.toLowerCase().trim() });
      var queryParams = {
        chartKind:  chartKind,
        queryWords: queryWords,
        gaids:      _.keys(this.selectedGAs),
        partyids:   _.keys(this.selectedParties),
        mpids:      _.keys(this.selectedMps),
        groupBy:    this[chartKind].groupBy,
        dateGran:   this[chartKind].dateGran || null // null for barchart
      };
      self = this;
      $.get('/search/query_server', queryParams, function(response) {
        self.updateChartStates(chartKind);
        self.handleQueryResponse(response.results, chartKind, queryWords);
        self.prevQueryString = self.currQueryString;
      });
    }
  },

  shouldQuery: function(chartKind) {
    return this.currQueryString && !this[chartKind].loaded;
  },

  resetChartStates: function() {
    this.timeseries = {loaded: false, groupBy: 'word', dateGran: 'week'};
    this.barchart = {loaded: false, groupBy: 'party'};
  },

  updateChartStates: function(updatedChartKind) {
    this[updatedChartKind].loaded = true;
  },

  handleQueryResponse: function(results, chartKind, queryWords) {
    var pubData = this.defaultPublishData();
    pubData.chartKind = chartKind;
    var dp = DataProcessingUtils;
    var groupBy = this[chartKind].groupBy;
    if (chartKind === 'timeseries') {
      var dateGran = this[chartKind].dateGran;
      pubData.results = dp.processTimeseriesData(results, queryWords, groupBy, dateGran);
    } else {
      pubData.results = dp.processBarchartData(results, queryWords, groupBy);
    }
    this.trigger(pubData);
  },

  // Grab and store data from FilterItemsStore for querying
  grabFilterData: function(filterData) {
    this.selectedGAs = filterData.selectedGAs;
    this.selectedParties = filterData.selectedParties;
    this.selectedMps = filterData.selectedMps;
  },

  defaultPublishData: function() {
    return {
      isTimeseriesLoaded: this.timeseries.loaded,
      timeseriesGroupBy:  this.timeseries.groupBy,
      dateGran:           this.timeseries.dateGran,
      isBarchartLoaded:   this.barchart.loaded,
      barchartGroupBy:    this.barchart.groupBy
    };
  }

});

module.exports = QueryDataStore;