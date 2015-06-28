var Searchbar = React.createClass({

  maybeQuery: function(event) {
    if (event.keyCode === 13) this.query();
  },

  query: function() {
    var query_string = this.refs.query_string.getDOMNode().value.trim()
    this.props.onQuery(query_string);
  },

  render: function() {
    return (
      <div className="row" id="searchbar-wrap">
        <div className="col-md-9">
          <div className="input-group input-group-lg">
            <input onKeyDown={this.maybeQuery} type="text" className="form-control" placeholder="Leitarorð, t.d. heimilin" ref="query_string" />
            <span className="input-group-btn" id="search-icon">
              <button onClick={this.query} className="btn btn-primary">Search</button>
            </span>
          </div>
        </div>
      </div>
    );
  }

});