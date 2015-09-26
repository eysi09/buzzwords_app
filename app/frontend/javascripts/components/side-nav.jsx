var SideNav = React.createClass({

  render: function() {
    return ( 
      <section data-spy="affix" className="side-nav">
        <a href="#" data-name="home" onClick={this.props.onLinkClick}>Heim</a>
        <a href="#" data-name="timeseries" onClick={this.props.onLinkClick}>Tímaröð</a>
        <a href="#" data-name="barchart" onClick={this.props.onLinkClick}>Stöplarit</a>
      </section>
    );
  }

});

module.exports = SideNav;