var Reflux          = require('reflux'),    
    QueryDataStore  = require('../stores/query-data-store'),
    D3Timeseries    = require('../charts/timeseries');

var TimeseriesController = React.createClass({

  mixins: [Reflux.connectFilter(QueryDataStore, 'results', function(queryData) {
    if (queryData.chartKind === 'timeseries') { 
      return queryData.results;
    } else { // Keep old
      return this.state.results;
    }
  })],

  getInitialState: function() {
    return {results: []};
  },
  
  render: function() {
    var content = _.isEmpty(this.state.results) ? '' : <Timeseries results={this.state.results} />
    return <div id="timeseries">
      {content}
    </div>
  }

});

var Timeseries = React.createClass({

  getInitialState: function() {
    return {
      firstRender:  true,
      chart:        null
    };
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    this.initalizeChart(el);
  },

  componentWillReceiveProps: function() {
    this.setState({firstRender: false});
  },

  componentDidUpdate: function() {
    this.updateChart();
  },

  initalizeChart: function(el) {
    var opts = {
      width:        960,
      height:       500,
      dateKey:     'date',
      yAxisLabel:   'Tíðni',
      yTickFormat:  'd',
    }
    this.setState({chart: D3Timeseries.initalize(el, opts)});
  },

  updateChart: function() {
    this.state.chart.render(this.props.results, this.state.firstRender);
  },

  render: function() {
    return <div className="row timeseries-inner-wrap">
    </div>;
  }

});

module.exports = TimeseriesController;