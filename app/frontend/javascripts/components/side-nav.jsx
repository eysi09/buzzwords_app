var Reflux          = require('reflux'),
    Actions         = require('../actions/actions'),
    QueryDataStore  = require('../stores/query-data-store');

var SideNav = React.createClass({

  mixins: [Reflux.connectFilter(QueryDataStore, function(queryData) {
    return {
      timeseries: queryData.isTimeseriesLoaded,
      barchart: queryData.isBarchartLoaded
    }
  })],

  getInitialState: function() {
    return {
      timeseries: false,
      barchart:   false
    };
  },

  shouldComponentUpdate: function() {
    return false;
  },

  handleLinkClick: function(event) {
    var linkName = event.target.dataset.name;
    if (linkName !== 'home' && !this.state[linkName]) { Actions.requestQuery(linkName, 'linkClick', null); }
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