$(document).ready(function() {

  var SearchBar = React.createClass({
    render: function() {
      return (
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Search..." />
        </form>
      );
    }
  });

  React.renderComponent(<SearchBar />, document.body);

});