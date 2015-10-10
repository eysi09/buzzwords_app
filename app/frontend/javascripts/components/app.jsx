var Reflux                = require('reflux'),
    Searchbar             = require('./searchbar'),
    Select                = require('./select'),  
    SideNav               = require('./side-nav'),
    TimeseriesController  = require('./timeseries'),
    BarchartController    = require('./barchart'),
    Actions               = require('../actions/actions'),
    InitDataStore         = require('../stores/init-data-store'); 

var App = React.createClass({

  mixins: [Reflux.connectFilter(InitDataStore, initData => {
    return {data: I.Map({initData: initData})}
  })],

  getInitialState: function() {
    return {data: I.Map({initData: I.Map()})};
  },

  componentDidMount: function() {
    Actions.getInitData();
  },

  render: function() {
    // <SearchResultsTable data={this.state.results}/>
    // Re-insert below barchartwrap!
    var state = this.state.data;
    return <div className="container">
      <Searchbar onQuery={this.handleQuery}/>
      <div id="filters" className="row filter-wrap">
        <Select data={I.Map({name: 'gaSelect', initData: state.get('initData')})} />
        <Select data={I.Map({name: 'partySelect', initData: state.get('initData')})} />
        <Select data={I.Map({name: 'mpSelect', initData: state.get('initData')})} />
      </div>
      <TimeseriesController />
      <BarchartController />
      <SideNav onLinkClick={this.handleLinkClick}/>
    </div>
  }
});

module.exports = App;
