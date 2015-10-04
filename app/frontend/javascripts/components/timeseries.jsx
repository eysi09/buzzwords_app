var Reflux          = require('reflux'),    
    QueryDataStore  = require('../stores/query-data-store'),
    Actions         = require('../actions/actions'),
    GroupBySettings = require('./group-by-settings'),
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
    var content = '';
    if (!_.isEmpty(this.state.results)) {
      content = [<div className="row options-wrap" key="opts">
        <GroupBySettings chartKind='timeseries' />
        <DateGranSettings />
      </div>,
      <Timeseries key="ts-chart" results={this.state.results}/>]
    }
    return <div id="timeseries">
      {content}
    </div>
  }

});

var DateGranSettings = React.createClass({

  mixins: [Reflux.connectFilter(QueryDataStore, 'dateGran', function(queryData) {
    return queryData.dateGran;
  })],

  getInitialState: function() {
    return {
      dateGran:   'week',
      isExpanded: false,
    }
  },

  toggleExpanded: function() {
    this.setState({isExpanded: !this.state.isExpanded})
  },

  handleOptionClick: function(event) {
    event.stopPropagation();
    this.setState({isExpanded: false});
    var dateGran = event.target.dataset.id;
    Actions.chartSettingsChange('timeseries', 'dateGran', dateGran);
  },


  render: function() {
    var list = '';
    var options = {
      day:    'Dagur',
      week:   'Vika',
      month:  'Mánuður',
      year:   'Ár'
    }
    var selected = options[this.state.dateGran];
    if (this.state.isExpanded) {
      list = <ul className="option-wrap">
        {_.map(options, function(val, key) {
          var icon = this.state.dateGran === key ? <i className="glyphicon glyphicon-ok"></i> : '';
          return <li className="option" data-id={key} key={key} onClick={this.handleOptionClick} >
            {icon}
            {val}
          </li>
        }, this)}
      </ul>
    }
    return <div className="col-md-3 select" onClick={this.toggleExpanded}>
      Grófleiki: {selected}
      {list}
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