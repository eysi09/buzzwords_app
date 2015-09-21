var langUtils = require('../utils/lang_utils');

var Select = React.createClass({

  getInitialState: function() {
    return {
      isExpanded: false
    };
  },

  toggleSelectState: function() {
    this.setState({isExpanded: !this.state.isExpanded})
  },

  render: function() {
    var count = _.keys(this.props.data.selection).length;
    var name = this.props.name;
    var selectLabel = '';
    if (count === 0) {
      selectLabel = {
        gaSelect:     'Veldu þingár',
        partySelect:  'Veldu þingflokk',
        mpSelect:     'Veldu þingmann'
      }[name];
    } else if (count === 1) {
      selectLabel = {
        gaSelect:     'Eitt þingár valið',
        partySelect:  'Einn þingflokkur valinn',
        mpSelect:     'Einn þingmaður valinn'
      }[name];
    } else if (count > 1) {
      selectLabel = {
        gaSelect:     langUtils.number2words(count, 'neuter') + ' þingár valin',
        partySelect:  langUtils.number2words(count, 'masc')  + ' þingflokkar valdir',
        mpSelect:     langUtils.number2words(count, 'fem') + ' þingmenn valdir'
      }[name];
    }
    if (this.state.isExpanded) {
      var content = <OptionWrap onOptionClick={this.props.onOptionClick} data={this.props.data} parentSelect={name}/>;
    } else {
      var content = '';
    }
    return <div className='col-md-3 select' data-name={name} onClick={this.toggleSelectState}>
      {selectLabel}
      {content}
    </div>
  }

});

var OptionWrap = React.createClass({

  render: function() {
    var ids = this.props.data.ids;
    var values = this.props.data.values;
    var selection = this.props.data.selection;
    var parentSelect = this.props.parentSelect;
    var componentGetter = function(id) {
      return {
        gaSelect:     <GAOption key={id} data={{id: id, values: values[id]}} />,
        partySelect:  <PartyOption key={id} data={id} />,
        mpSelect:     <MpOption key={id} data={values[id]} />
      }[parentSelect]
    };
    var iconGetter = function(id) {
      return selection[id] ? <i className="glyphicon glyphicon-ok"></i> : '';
    };
    return <ul className="option-wrap">
      {_.map(ids, function(id) {
        return <li className="option" data-id={id} data-parentselect={parentSelect} onClick={this.props.onOptionClick} key={id}>
          {iconGetter(id)}
          {componentGetter(id)}
        </li>
      }, this)}
    </ul>
  }

});

var GAOption = React.createClass({

  render: function() {
    var values = this.props.data.values;
    return <div>
      {this.props.data.id + ' (' + values.year_from + ' - ' + values.year_to + ')'}
    </div>
  }

});

var PartyOption = React.createClass({

  render: function() {
    return <div>
      {this.props.data}
    </div>
  }

});

var MpOption = React.createClass({

  render: function() {
    return <div>
      {this.props.data}
    </div>
  }

});

module.exports = Select;