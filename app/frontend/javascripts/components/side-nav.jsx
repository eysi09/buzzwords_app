var Reflux          = require('reflux'),
    Actions         = require('../actions/actions'),
    QueryDataStore  = require('../stores/query-data-store');

var SideNav = React.createClass({

  mixins: [Reflux.connectFilter(QueryDataStore, 'chartStates', function(queryData) {
    return {
      timeseries: queryData.timeseries,
      barchart: queryData.barchart
    }
  })],

  getInitialState: function() {
    return {chartStates: {
      timeseries: {loaded: false},
      barchart:   {loaded: false}
    }}
  },

  shouldComponentUpdate: function() {
    return false;
  },

  handleLinkClick: function(event) {
    var linkName = event.target.dataset.name;
    if (linkName !== 'home' && !this.state.chartStates[linkName].loaded) { Actions.requestQuery(linkName, 'linkClick', null); }
  },


  render: function() {
    return ( 
      <section data-spy="affix" className="side-nav">
        <a href="#home" id="home-link" data-name="home" onClick={this.handleLinkClick}>Heim</a>
        <a href="#timeseries" id="timeseries-link" data-menu-top="100" data-name="timeseries" onClick={this.handleLinkClick}>Tímaröð</a>
        <a href="#barchart" id="barchart-link" data-name="barchart" onClick={this.handleLinkClick}>Stöplarit</a>
      </section>
    );
  }

});

module.exports = SideNav;