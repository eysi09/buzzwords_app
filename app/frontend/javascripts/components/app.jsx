var Reflux                = require('reflux'),
    Searchbar             = require('./searchbar'),
    Select                = require('./select'),  
    SideNav               = require('./side-nav'),
    TimeseriesController  = require('./timeseries'),
    BarchartController    = require('./barchart'),
    Actions               = require('../actions/actions'),
    InitDataStore         = require('../stores/init-data-store'); 

var App = React.createClass({

  mixins: [Reflux.connect(InitDataStore, 'initData')],

  getInitialState: function() {
    return {initData: {}};
  },

  componentDidMount: function() {
    Actions.getInitData();
  },

  render: function() {
    // <SearchResultsTable data={this.state.results}/>
    // Re-insert below barchartwrap!
    return <div className="container">
      <Searchbar onQuery={this.handleQuery}/>
      <div id="filters" className="row filter-wrap">
        <Select name={'gaSelect'} initData={this.state.initData} />
        <Select name={'partySelect'} initData={this.state.initData} />
        <Select name={'mpSelect'} initData={this.state.initData} />
      </div>
      <TimeseriesController />
      <BarchartController />
      <SideNav onLinkClick={this.handleLinkClick}/>
    </div>
  }
});

module.exports = App;
