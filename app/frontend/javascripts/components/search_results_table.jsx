var SearchResultsTable = React.createClass({

  render: function() {
    var rows = _.map(this.props.data, function(row_data) {
      return <SearchResultsRow row_data={row_data}/>;
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