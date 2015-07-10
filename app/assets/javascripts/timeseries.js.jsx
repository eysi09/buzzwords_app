var TimeseriesWrap = React.createClass({

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
      dateKey:     'date',
      yAxisLabel:   'Tíðni',
      yTickFormat:  'd',
    }
    this.setState({chart: timeseriesChart.initalize(el, opts)});
  },

  updateChart: function() {
    var data = this.processData(this.props.data.results, 'parties', 'MMYYYY');
    this.state.chart.render(data, this.state.firstRender);
  },

  processData: function(data, splitBy, dateGran) {
      console.log('Start processing timesseries data at ' + moment().format('HH:mm:ss'));
      var queryWords = this.props.data.queryWords;
      var dp = DataProcessingUtils;
      var splitByKeys = dp.getSplitByKeys(data, splitBy);
      var processedData = _.chain(data)
        .reduce(function(memo, d) {
          var wordFreq = {};
          var party = d.party;
          _.each(queryWords, function(w) {
            wordFreq[dp.wfKeyBuilder(d, w, splitBy)] = parseInt(d['wf_' + w]) || 0;
          })
          var date = moment(d.date).format(dateGran)
          if (!memo[date]) memo[date] = dp.initializeCount(queryWords, splitByKeys);
          memo[date] = dp.mergeAndAdd(memo[date], wordFreq);
          return memo;
        }, {})
        .reduce(function(memo, val, key) {
          memo.push(_.extend({date: moment(key, dateGran).toDate()}, val));
          return memo;
        }, [])
        .sortBy('date')
        .value();
      console.log('Finish processing timeseries data at ' + moment().format('HH:mm:ss'));
      console.log(processedData);
      return processedData;
    },

  render: function() {
    return <div className="row timeseries-wrap">
    </div>;
  }
});
