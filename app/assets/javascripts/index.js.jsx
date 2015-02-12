$(document).ready(function() {

  var SearchBar = React.createClass({
    render: function() {
      return (
        <form role="search" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <div className="input-group input-group-lg">
              <input type="text" className="form-control" placeholder="Search" />
              <span className="input-group-btn" id="search-icon">
                <button type="submit" className="btn btn-primary">Search</button>
              </span>
            </div>
          </div>
        </form>
      );
    },

    handleSubmit: function() {
      var data = {
        search_string: $('input').val()
      };
      $.get('/search/query_server', data, function(response) {
      });
    }

  });

  React.render(<SearchBar />, $('#search-bar-wrap')[0]);

});