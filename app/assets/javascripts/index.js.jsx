$(document).ready(function() {

  console.log('ready');
  /* Anticipated structure:

    -MainApplication
      -SearchBar
      -Visualizer
      -SearchResultsTable
        -SearchResultsTableHeader
        -SearchResultsRow
          -SearchResultsColumn?

  */

  var first_render = true;

  var MainApplication = React.createClass({
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
          <div className="container">
            <div className="row" id="search-bar-wrap">
              <SearchBar onQueryResponse={this.handleQueryResponse}/>
            </div>
          </div>
          <div className="container">
            <div className="row" id="visualizer-wrap">
              <Visualizer />
            </div>
          </div>
          <div className="container">
            <div className="row" id="search-results-wrap">
              <SearchResultsTable results={this.state.results}/>
            </div>
          </div>
        </section>
      );
    }
  });

  var SearchBar = React.createClass({
    render: function() {
      return (
        <div className="input-group input-group-lg">
          <input onKeyDown={this.triggerQuery} type="text" className="form-control" placeholder="Search" />
          <span className="input-group-btn" id="search-icon">
            <button onClick={this.handleQuery} className="btn btn-primary">Search</button>
          </span>
        </div>
      );
    },

    triggerQuery: function(event) {
      if (event.keyCode === 13) this.handleQuery();
    },

    handleQuery: function() {
      if (search_string = $('input').val()) {
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
      var rows = []
      this.props.results.forEach(function(row_data) {
        rows.push(<SearchResultsRow row_data={row_data} />)
      }.bind(this));
      return (
        <table className="table table:hover">
          <thead>
            <SearchResultsHeader />
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
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
      return (<span></span>
      );
    }
  });

  // Small workaround for now
  if (MainApplication) {
    React.render(<MainApplication />, $('#search-section')[0]);
  }  

});