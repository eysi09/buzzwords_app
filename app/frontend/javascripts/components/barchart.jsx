var moment              = require('moment');
var D3Barchart          = require('../charts/barchart');
var DataProcessingUtils = require('../utils/data-processing-utils');

var Barchart = React.createClass({

  getInitialState: function() {
    return {
      firstRender:  true,
      chart:        null,
    };
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    this.initalizeChart(el);
  },

  shouldComponentUpdate:function(nextProps) {
    return nextProps.newDataReceived;
  },

  componentDidUpdate: function() {
    this.updateChart();
  },

  componentWillReceiveProps: function() {
    this.setState({
      firstRender: false,
    });
  },

  initalizeChart: function(el) {
    var opts = {
      width:        960,
      height:       500,
      yAxisLabel:   'Tíðni',
      yTickFormat:  'd',
    }
    this.setState({chart: D3Barchart.initialize(el, opts)});
  },

  updateChart: function() {
    var data = this.processData(this.props.data, 'party', this.props.queryWords);
    this.state.chart.render(data, this.state.firstRender);
  },

  processData: function(data, groupBy) {
    console.log('Start processing barchart data at ' + moment().format('HH:mm:ss'));
    var queryWords = this.props.queryWords;
    var dp = DataProcessingUtils;
    var groupByKeys = dp.getGroupByKeys(data, groupBy);
    var count = dp.initializeCount(queryWords, groupByKeys);
    _.each(data, function(d) {
      var wordFreq = {};
      _.each(queryWords, function(w) {
        wordFreq[dp.wfKeyBuilder(d, w, groupBy)] = parseInt(d['wf_' + w]) || 0;
      });
      count = dp.mergeAndAdd(count, wordFreq);
    });
    var processedData = _.chain(count)
      .map(function(v, k) { return {x_val: k, y_val: v} })
      .sortBy('y_val')
      .reverse()
      .value();

    console.log('Finish processing barchart data at ' + moment().format('HH:mm:ss'));
    console.log(processedData);
    return processedData;
  },

  render: function() {
    return <div id="barchart" className="row barchart-wrap">
    </div>;
  }

});

module.exports = Barchart;