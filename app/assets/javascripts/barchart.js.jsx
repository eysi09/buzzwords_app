var BarchartWrap = React.createClass({

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
    return nextProps.data.newDataReceived;
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
    this.setState({chart: barChart.initialize(el, opts)});
  },

  updateChart: function() {
    var data = this.processData(this.props.data.results, 'mps', this.props.data.queryWords);
    this.state.chart.render(data, this.state.firstRender);
  },

  processData: function(data, splitBy) {
    console.log('Start processing barchart data at ' + moment().format('HH:mm:ss'));
    var queryWords = this.props.data.queryWords;
    var dp = DataProcessingUtils;
    var splitByKeys = dp.getSplitByKeys(data, splitBy);
    var count = dp.initializeCount(queryWords, splitByKeys);
    _.each(data, function(d) {
      var wordFreq = {};
      _.each(queryWords, function(w) {
        wordFreq[dp.wfKeyBuilder(d, w, splitBy)] = parseInt(d['wf_' + w]) || 0;
      })
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
    return <div className="row barchart-wrap">
    </div>;
  }

});