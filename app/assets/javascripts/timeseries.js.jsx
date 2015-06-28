var TimeseriesWrap = React.createClass({

  getInitialState: function() {
    return {
      processedData: null
    };
  },
  
  componentDidMount: function() {
    var el = this.getDOMNode();
    this.initalizeChart(el);
  },

  componentDidUpdate: function() {
    this.processData();
    this.updateChart();
  },

  initalizeChart: function(el) {
    var opts = {
      width:        799,
      height:       400,
      date_key:     'date',
      yAxisLabel:   'Tíðni',
      yTickFormat:  'd',
      rollCurtain:  true,
      format_date:  function(d) { return moment(d).format('YYYY-MM-DD')},
    }
    //timeseriesChart.initalize(el, opts);
  },

  processData: function() {
    if ((data = this.props.data).length > 0) {
      console.log(moment().format());
      var processedData = _.chain(data)
        .reduce(function(memo, d) {
          var date = moment(d.date).format('MMDDYYYY');
          memo[date] = d.word_freq;
          return memo;
        }, {})
        .reduce(function(memo, val, key) {
          memo.push(_.extend({date: key}, val));
          return memo;
        }, [])
        .value();
      console.log(moment().format());
    }
  },

  updateChart: function() {
    //timeseriesChart.render(this.state.processedData);
  },

  render: function() {
    return <div className="row timeseries-wrap">
    </div>;
  }
});
