$(document).ready(function() {

  console.log('ready');

  /* Anticipated structure:

    -SearchBox
      -SearchBar
      -Visualizer
      -SearchResultsTable
        -SearchResultsTableHeader
        -SearchResultsRow
          -SearchResultsColumn?
  */

  var SearchBox = React.createClass({
    getInitialState: function() {
      return {
        results: []
      };
    },

    handleQueryResponse: function(results) {
      this.setState({
        results: results
      })
    },

    render: function() {
      return (
        <div className="container">
          <SearchBar onQueryResponse={this.handleQueryResponse}/>
          <Visualizer />
          <SearchResultsTable results={this.state.results}/>
        </div>
      );
    }
  });

  var SearchBar = React.createClass({
    render: function() {
      return (
        <div className="row" id="searchbar-wrap">
          <div className="col-md-9">
            <div className="input-group input-group-lg">
              <input onKeyDown={this.maybeHandleQuery} type="text" className="form-control" placeholder="Search" ref="query_string" />
              <span className="input-group-btn" id="search-icon">
                <button onClick={this.handleQuery} className="btn btn-primary">Search</button>
              </span>
            </div>
          </div>
        </div>
      );
    },

    maybeHandleQuery: function(event) {
      if (event.keyCode === 13) this.handleQuery();
    },

    handleQuery: function() {
      if (search_string = this.refs.query_string.getDOMNode().value.trim()) {
        var data = {
          search_string: search_string
        };
        this_guy = this;
        $.get('/search/query_server', data, function(response) {
          this_guy.props.onQueryResponse(response.results);
        });
      } else {
        this.props.onQueryResponse([]);
      }
    }
  });

  var Visualizer = React.createClass({
    render: function() {
      return (<div></div>);
    }
  });

  var SearchResultsTable = React.createClass({

    render: function() {
      var rows = _.map(this.props.results, function(row_data) {
        return <SearchResultsRow row_data={row_data} />;
      })
      return (
        <div className="row" id="search-results-wrap">
          <div className="col-md-9">
            <table className="table table:hover">
              <thead>
                <SearchResultsHeader />
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  });

  var SearchResultsHeader = React.createClass({
    render: function() {
      return (
        <tr>
          <th>MP</th>
          <th>Count</th>
        </tr>
      );
    }
  });

  var SearchResultsRow = React.createClass({
    render: function() {
      return (
        <tr>
          <td>{this.props.row_data[0]}</td>
          <td>{this.props.row_data[1]}</td>
        </tr>
      );
    }
  });

  var SearchResultsColumn = React.createClass({
    render: function() {
      return (
        <span></span>
      );
    }
  });

  // Get init data
  // Using backbone for this since react is not playing
  // nice with boostrap select
  $.get('/search/init_data', {}, function(response) {

    var filter_view = new FilterView({
      el:               $('#search-section'),
      ga_data_hash:     response.ga_data_hash,
      parties_mps_hash: response.parties_mps_hash,
      mps_name_hash:    response.mps_name_hash
    })
  }.bind(this));

  React.render(<SearchBox />, $('#search-section')[0]);

});