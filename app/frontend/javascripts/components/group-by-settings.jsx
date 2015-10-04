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
    var options = '';
    var selected = {
      word:                 'Orði',
      mp_id:                'Þingmanni',
      party:                'Þingflokki',
      general_assembly_id:  'Þingári'
    }[this.state.groupBy];
    if (this.state.isExpanded) {
      options = <ul className="option-wrap">
        <li className="option" data-id="word" onClick={this.handleOptionClick}>Orði</li>
        <li className="option" data-id="mp_id" onClick={this.handleOptionClick}>Þingmanni</li>
        <li className="option" data-id="party" onClick={this.handleOptionClick}>Þingflokki</li>
        <li className="option" data-id="general_assembly_id" onClick={this.handleOptionClick}>Þingári</li>
      </ul>
    }
    return <div className="col-md-3 select" onClick={this.toggleExpanded}>
      Flokka eftir: {selected}
      {options}
    </div>
  }

});

module.exports = GroupBySettings