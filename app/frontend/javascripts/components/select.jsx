var Reflux            = require('reflux'),
    FilterItemsStore  = require('../stores/filter-items-store'),
    Actions           = require('../actions/actions'),
    langUtils         = require('../utils/lang-utils');

var Select = React.createClass({

  mixins: [Reflux.connectFilter(FilterItemsStore, 'filterData', function(filterData) {
    var selectedIds = filterData[{
      gaSelect:     'selectedGAs',
      partySelect:  'selectedParties',
      mpSelect:     'selectedMps'
    }[this.props.name]];
    var visibleIds = filterData[{
      gaSelect:     'visibleGAIds',
      partySelect:  'visiblePartyIds',
      mpSelect:     'visibleMpIds'
    }[this.props.name]];
    return {
      selectedIds:  selectedIds,
      visibleIds:   visibleIds
    }
  })],

  getInitialState: function() {
    return {
      isExpanded: false,
      filterData: {}
    };
  },

  toggleSelectState: function() {
    this.setState({isExpanded: !this.state.isExpanded})
  },

  render: function() {
    var name = this.props.name;
    var count = _.keys(this.state.filterData.selectedIds).length;
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
      var content = <OptionWrap
        initData={this.props.initData}
        filterData={this.state.filterData}
        parentSelect={name}/>;
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

  handleClick: function(event) {
    event.stopPropagation();
    var data = event.target.parentNode.dataset;
    var selectName = data.parentselect;
    var id = selectName === 'partySelect' ? data.id : parseInt(data.id);
    Actions.filterItemClick(id, selectName)
  },

  render: function() {
    var ids = this.props.filterData.visibleIds;
    var selectedIds = this.props.filterData.selectedIds;
    var parentSelect = this.props.parentSelect;
    var gaData = this.props.initData.gaDataHash;
    var mpNames = this.props.initData.mpsNameHash;
    var componentGetter = function(id) {
      return {
        gaSelect:     <GAOption key={id} value={id} data={gaData[id]} />,
        partySelect:  <PartyOption key={id} value={id} />,
        mpSelect:     <MpOption key={id} value={mpNames[id]} />
      }[parentSelect]
    };
    var iconGetter = function(id) {
      return selectedIds[id] ? <i className="glyphicon glyphicon-ok"></i> : '';
    };
    return <ul className="option-wrap">
      {_.map(ids, function(id) {
        return <li className="option" data-id={id} data-parentselect={parentSelect} onClick={this.handleClick} key={id}>
          {iconGetter(id)}
          {componentGetter(id)}
        </li>
      }, this)}
    </ul>
  }

});

var GAOption = React.createClass({

  render: function() {
    var data = this.props.data;
    return <div>
      {this.props.value + ' (' + data.year_from + ' - ' + data.year_to + ')'}
    </div>
  }

});

var PartyOption = React.createClass({

  render: function() {
    return <div>
      {this.props.value}
    </div>
  }

});

var MpOption = React.createClass({

  render: function() {
    return <div>
      {this.props.value}
    </div>
  }

});

module.exports = Select;