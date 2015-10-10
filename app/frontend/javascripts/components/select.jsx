var Reflux            = require('reflux'),
    FilterItemsStore  = require('../stores/filter-items-store'),
    Actions           = require('../actions/actions'),
    langUtils         = require('../utils/lang-utils');

var Select = React.createClass({
  mixins: [Reflux.connectFilter(FilterItemsStore, function(filterData) {
    var name = this.props.data.get('name');
    var getSelected = d => d.get({
      gaSelect:     'selectedGAs',
      partySelect:  'selectedParties',
      mpSelect:     'selectedMps'
    }[name]);
    var getVisible = d => d.get({
      gaSelect:     'visibleGAIds',
      partySelect:  'visiblePartyIds',
      mpSelect:     'visibleMpIds'
    }[name]);
    var d = this.state.data
      .set('selectedIds', getSelected(filterData))
      .set('visibleIds', getVisible(filterData));
    return {data: d}
  })],

  getInitialState: function() {
    return { data: I.Map({
        isExpanded:   false,
        selectedIds:  I.Map(),
        visibleIds:   I.List()
      })
    };
  },

  toggleExpanded: function() {
    this.setState(({data}) => ({
      data: data.update('isExpanded', v => !v)
    }));
  },

  render: function() {
    var state = this.state.data;
    var props = this.props.data;
    var name = props.get('name');
    var count = state.get('selectedIds').count();
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
    if (state.get('isExpanded')) {
      var data = I.Map({
        initData:     props.get('initData'),
        selectedIds:  state.get('selectedIds'),
        visibleIds:   state.get('visibleIds'),
        parentSelect: name
      });
      var content = <OptionWrap data={data} />
    } else {
      var content = '';
    }
    return <div className='col-md-3 select' data-name={name} onClick={this.toggleExpanded}>
      {selectLabel}
      {content}
    </div>
  }

});

var OptionWrap = React.createClass({

  handleClick: function(event) {
    event.stopPropagation();
    var data = event.target.parentNode.dataset;
    var selectName = this.props.data.get('parentSelect');
    var id = selectName === 'partySelect' ? data.id : parseInt(data.id);
    switch (selectName) {
      case 'gaSelect':
        Actions.updateSelectedGAs(id);
        break;
      case 'partySelect':
        Actions.updateSelectedParties(id);
        break;
      case 'mpSelect':
        Actions.updateSelectedMps(id)
        break;
    }
  },

  render: function() {
    var props = this.props.data;
    var ids = props.get('visibleIds');
    var selectedIds = props.get('selectedIds');
    var parentSelect = props.get('parentSelect');
    var gaData = props.getIn(['initData', 'gaDataHash']);
    var mpNames = props.getIn(['initData', 'mpsNameHash']);
    var componentGetter = id => {
      return {
        gaSelect:     <GAOption key={id} data={I.Map({value: id, extra: gaData.get(String(id))})} />,
        partySelect:  <PartyOption key={id} data={I.Map({value: id})} />,
        mpSelect:     <MpOption key={id} data={I.Map({value: mpNames.get(String(id))})} />
      }[parentSelect]
    };
    var iconGetter = id => selectedIds.get(id) ? <i className="glyphicon glyphicon-ok"></i> : '';
    return <ul className="option-wrap">
      {ids.map(id => {
        return <li className="option" data-id={id} onClick={this.handleClick} key={id}>
          {iconGetter(id)}
          {componentGetter(id)}
        </li>
      }).toArray()}
    </ul>
  }

});

var GAOption = React.createClass({

  render: function() {
    var data = this.props.data;
    var extra = data.get('extra');
    return <div>
      {data.get('value') + ' (' + extra.get('year_from') + ' - ' + extra.get('year_to') + ')'}
    </div>
  }

});

var PartyOption = React.createClass({

  render: function() {
    return <div>
      {this.props.data.get('value')}
    </div>
  }

});

var MpOption = React.createClass({

  render: function() {
    return <div>
      {this.props.data.get('value')}
    </div>
  }

});

module.exports = Select;