var Reflux          = require('reflux'),    
    QueryDataStore  = require('../stores/query-data-store'),
    D3Barchart      = require('../charts/barchart');

var BarchartController = React.createClass({

  mixins: [Reflux.connectFilter(QueryDataStore, 'results', function(queryData) {
    if (queryData.chartKind === 'barchart') { 
      return queryData.results;
    } else { // Keep old
      return this.state.results;
    }
  })],

  getInitialState: function() {
    return {results: []};
  },
  
  render: function() {
    var content = _.isEmpty(this.state.results) ? '' : <Barchart results={this.state.results} />
    return <div id="barchart">
      {content}
    </div>
  }

});

var Barchart = React.createClass({

  getInitialState: function() {
    return {chart: null}
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    this.initalizeChart(el);
  },

  componentDidUpdate: function() {
    this.updateChart();
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
    this.state.chart.render(this.props.results);
  },

  render: function() {
    return <div className="row barchart-inner-wrap">
    </div>;
  }

});

module.exports = BarchartController;