var Reflux          = require('reflux'),    
    QueryDataStore  = require('../stores/query-data-store'),
    Actions         = require('../actions/actions');

var GroupBySettings = React.createClass({

  mixins: [Reflux.connectFilter(QueryDataStore, 'groupBy', function(queryData) {
    if (this.props.chartKind === 'timeseries') { return queryData.timeseriesGroupBy; }
    else { return queryData.barchartGroupBy; }
  })],

  getInitialState: function() {
    var groupBy = this.props.chartKind === 'timeseries' ? 'word' : 'party';
    return {
      groupBy:    groupBy,
      isExpanded: false,
    }
  },

  toggleExpanded: function() {
    this.setState({isExpanded: !this.state.isExpanded})
  },

  handleOptionClick: function(event) {
    event.stopPropagation();
    this.setState({isExpanded: false});
    var groupBy = event.target.dataset.id;
    Actions.chartSettingsChange(this.props.chartKind, 'groupBy', groupBy);
  },

  render: function() {
    var list = '';
    var options = {
      word:                 'Orði',
      mp_id:                'Þingmanni',
      party:                'Þingflokki',
      general_assembly_id:  'Þingári'
    };
    var selected = options[this.state.groupBy];
    if (this.state.isExpanded) {
      list = <ul className="option-wrap">
        {_.map(options, function(val, key) {
          var icon = this.state.groupBy === key ? <i className="glyphicon glyphicon-ok"></i> : '';
          return <li className="option" data-id={key} key={key} onClick={this.handleOptionClick} >
            {icon}
            {val}
          </li>
        }, this)}
      </ul>
    }
    return <div className="col-md-3 select" onClick={this.toggleExpanded}>
      Flokka eftir: {selected}
      {list}
    </div>
  }

});

module.exports = GroupBySettings