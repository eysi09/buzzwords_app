var Reflux            = require('reflux'),
    Actions           = require('../actions/actions'),
    QueryStringStore  = require('../stores/query-string-store');

var Searchbar = React.createClass({

  mixins: [Reflux.connect(QueryStringStore, 'queryString')],

  getInitialState: function() {
    return {queryString: ''}
  },

  handleChange: function() {
    Actions.searchbarChange(event.target.value);
  },

  handleKeyDown: function(event) {
    if (event.keyCode === 13) this.handleQuery();
  },

  handleQuery: function() {
    if (this.state.queryString) {
      Actions.requestQuery('timeseries', 'searchbar');
      // scroll to timeseries
      skrollr.menu.click(document.getElementById('timeseries-link'));
    } else {
      Actions.resetQuery();
    }
  },

  render: function() {
    return (
      <div className="row" id="searchbar-wrap">
        <div className="col-md-9">
          <div className="input-group input-group-lg">
            <input
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              type="text" className="form-control"
              placeholder="Leitarorð, t.d. heimilin"
              value={this.state.queryString}
            />
            <span className="input-group-btn" id="search-icon">
              <button onClick={this.handleQuery} className="btn btn-primary">Search</button>
            </span>
          </div>
        </div>
      </div>
    );
  }

});
module.exports = Searchbar;
