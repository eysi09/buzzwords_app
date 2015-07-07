var TimeseriesWrap = React.createClass({

  getInitialState: function() {
    return {
      firstRender:  true,
      chart:        null
    };
  },
  
  componentDidMount: function() {
    console.log('mounting timeseries...')
    var el = this.getDOMNode();
    this.initalizeChart(el);
  },

  componentDidUpdate: function() {
    console.log('updating timeseries...')
    this.updateChart();
  },

  componentWillReceiveProps: function() {
    this.setState({firstRender: false});
  },

  initalizeChart: function(el) {
    var opts = {
      width:        799,
      height:       400,
      dateKey:     'date',
      yAxisLabel:   'Tíðni',
      yTickFormat:  'd',
    }
    this.setState({chart: timeseriesChart.initalize(el, opts)});
  },



  updateChart: function() {
    if ((d = this.props.data).length > 0) this.state.chart.render(d, this.state.firstRender);
  },

  render: function() {
    return <div className="row timeseries-wrap">
    </div>;
  }
});
