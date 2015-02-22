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
        <section id="search-section">
          <SearchBar onQueryResponse={this.handleQueryResponse}/>
          <Visualizer />
          <SearchResultsTable results={this.state.results}/>
        </section>
      );
    }
  });

  var SearchBar = React.createClass({
    render: function() {
      return (
        <div className="container">
          <div className="row" id="search-bar-wrap">
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
      return (
        <div className="container">
          <div className="row" id="visualizer-wrap">
            <select className="selectpicker" multiple data-selected-text-format="count">
              <option>Mustard</option>
              <option>Ketchup</option>
              <option>Relish</option>
            </select>
          </div>
        </div>
      );
    }
  });

  var SearchResultsTable = React.createClass({

    render: function() {
      var rows = _.map(this.props.results, function(row_data) {
        return <SearchResultsRow row_data={row_data} />;
      })
      return (
        <div className="container">
          <div className="row" id="search-results-wrap">
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

  React.render(<SearchBox />, $('#search-section')[0]);

});