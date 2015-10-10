var Reflux          = require('reflux'),
    QueryDataStore  = require('../stores/query-data-store'),
    GroupBySettings = require('./group-by-settings'),
    D3Barchart      = require('../charts/barchart');

var BarchartController = React.createClass({

  mixins: [Reflux.connectFilter(QueryDataStore, function(queryData) {
    if (queryData.chartKind === 'barchart') {
      return {
        results:          queryData.results,
        receivedNewData:  true
      }
    } else {
      return {receivedNewData: false};
    }
  })],

  getInitialState: function() {
    return {
      results:         [],
      receivedNewData: false
    };
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState.receivedNewData;
  },

  render: function() {
    var content = '';
    if (!_.isEmpty(this.state.results)) {
      content = [<div className="row options-wrap" key="opts">
        <GroupBySettings chartKind='barchart' />
      </div>,
      <Barchart key="bc-chart" results={this.state.results}/>]
    }
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