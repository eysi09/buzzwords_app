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

  var SearchControls = React.createClass({
    getInitialState: function() {
      return {
        gaDataHash:           {},
        partiesMpsHash:       {},
        mpsNameHash:          {},
        selectedGAs:          {},
        selectedParties:      {},
        selectedMps:          {},
        visibleGAOpts:        [],
        visiblePartyOpts:     [],
        visibleMpOpts:        [],
        gaSelectExpanded:     false,
        partySelectExpanded:  false,
        mpSelectExpanded:     false,
        results:              []
      };
    },

    componentDidMount: function() {
      $.get('/search/init_data', {}, function(response) {

        this.setState({
          gaDataHash:     response.ga_data_hash,
          partiesMpsHash: response.parties_mps_hash,
          mpsNameHash:    response.mps_name_hash,
          visibleGAIds:   _.keys(response.ga_data_hash).sort().reverse() // Always stays the same
        });
        this.updateVisibleOptions();
      }.bind(this));
    },

    handleQueryResponse: function(results) {
      this.setState({
        results: results
      })
    },

    toggleSelectState: function() {
      var obj = {}, selectState = {
        gaSelect:     'gaSelectExpanded',
        partySelect:  'partySelectExpanded',
        mpSelect:     'mpSelectExpanded'
      }[event.target.dataset.name];
      obj[selectState] = !this.state[selectState]
      this.setState(obj)
    },

    toggleOption: function(selectEl, id) {
      var id = selectEl === 'partySelect' ? id : parseInt(id);
      var selectionHolder = {
        gaSelect:     this.state.selectedGAs,
        partySelect:  this.state.selectedParties,
        mpSelect:     this.state.selectedMps
      }[selectEl]
      if (selectionHolder[id]) delete selectionHolder[id];
      else selectionHolder[id] = true;
      this.updateVisibleOptions();
    },

    // Þrot
    updateVisibleOptions: function() {
      var selectedGAIds = _.keys(this.state.selectedGAs);
      var selectedPartyIds = _.keys(this.state.selectedParties);
      var mpsByGAs = [];
      var mpsByParties = [];

      // Filter by GA selection
      if (selectedGAIds.length > 0) {
        var visiblePartyIds = _.reduce(selectedGAIds, function(memo, id) {
          mpsByGAs = _.uniq(mpsByGAs.concat(this.state.gaDataHash[id].mp_ids)); // mps come along for the ride
          return _.uniq(memo.concat(this.state.gaDataHash[id].parties))
        }, [], this);
      } else {
        var visiblePartyIds = _.keys(this.state.partiesMpsHash);
        var mpsByGAs = _.uniq(_.flatten(_.values(this.state.partiesMpsHash)));
      }

      // Remove hidden parties from selection
      var selectedParties = this.state.selectedParties;
      _.each(selectedPartyIds, function(id) {
        if (!_.contains(visiblePartyIds, id)) delete selectedParties[id]
      });
      selectedPartyIds = _.keys(selectedParties);

      // Filter by MP selection
      if (selectedPartyIds.length > 0) {
        var mpsByParties = _.reduce(selectedPartyIds, function(memo, id) {
          return _.uniq(memo.concat(this.state.partiesMpsHash[id]))
        }, [], this);
        var visibleMpIds = _.intersection(mpsByGAs, mpsByParties);
      } else {
        var visibleMpIds = mpsByGAs;
      }

      // Remove hidden mps from selection
      var selectedMps = this.state.selectedMps;
      _.each(selectedMps, function(val, key) {
        if (!_.contains(visibleMpIds, parseInt(key))) delete selectedMps[key]
      });

      // Sort
      visiblePartyIds.sort();
      visibleMpIds = _.sortBy(visibleMpIds, function(id) {
        return this.state.mpsNameHash[id];
      }, this);

      this.setState({
        visiblePartyIds: visiblePartyIds,
        visibleMpIds:    visibleMpIds,
        selectedParties: selectedParties,
        selectedMps:     selectedMps
      });
    },

    // Chart kinds: 
    //  bar
    //    year, 
    //    party, 
    //    mps
    //  timeseries
    //    party (default), 
    //    mp
    handleQuery: function(query_string) {
      if (query_string) {
        var data = {
          query_string:   query_string,
          gaids:          _.keys(this.state.selectedGAs),
          partyids:       _.keys(this.state.selectedParties),
          mpids:          _.keys(this.state.selectedMps),
          chart_kind:     'bar',
          group_by:       'mps'
        };
        self = this;
        $.get('/search/query_server', data, function(response) {
          self.onQueryResponse(response.results);
        });
      } else {
        this.onQueryResponse([]);
      }
    },

    render: function() {
      return <div className="container">
        <SearchBar onQuery={this.handleQuery}/>
        <div className="row filter-wrap">
          <Select onSelectClick={this.toggleSelectState}
                  onOptionClick={this.toggleOption}
                  name={'gaSelect'}
                  data={{ids: this.state.visibleGAIds, values: this.state.gaDataHash, selection: this.state.selectedGAs}}
                  isExpanded={this.state['gaSelectExpanded']}
                  />
          <Select onSelectClick={this.toggleSelectState}
                  onOptionClick={this.toggleOption}
                  name={'partySelect'}
                  data={{ids: this.state.visiblePartyIds, values: '', selection: this.state.selectedParties}}
                  isExpanded={this.state['partySelectExpanded']}
                  />
          <Select onSelectClick={this.toggleSelectState}
                  onOptionClick={this.toggleOption}
                  name={'mpSelect'}
                  data={{ids: this.state.visibleMpIds, values: this.state.mpsNameHash, selection: this.state.selectedMps}}
                  titleHash={this.state.mpsNameHash}
                  isExpanded={this.state['mpSelectExpanded']}
                  />
        </div>
        <Visualizer />
        <SearchResultsTable results={this.state.results}/>
      </div>
    }
  });

  var SearchBar = React.createClass({

    maybeQuery: function(event) {
      if (event.keyCode === 13) this.query();
    },

    query: function() {
      var query_string = this.refs.query_string.getDOMNode().value.trim()
      this.props.onQuery(query_string);
    },

    render: function() {
      return (
        <div className="row" id="searchbar-wrap">
          <div className="col-md-9">
            <div className="input-group input-group-lg">
              <input onKeyDown={this.maybeQuery} type="text" className="form-control" placeholder="Leitarorð, t.d. heimilin" ref="query_string" />
              <span className="input-group-btn" id="search-icon">
                <button onClick={this.query} className="btn btn-primary">Search</button>
              </span>
            </div>
          </div>
        </div>
      );
    }

  });

  var Select = React.createClass({

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
      if (this.props.isExpanded) {
        var content = <OptionWrap onOptionClick={this.props.onOptionClick} data={this.props.data} parentSelect={name}/>;
      } else {
        var content = '';
      }
      return <div className='col-md-3 select' data-name={name} onClick={this.props.onSelectClick}>
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
          return <li className="option" data-value={id} onClick={this.props.onOptionClick.bind(null, parentSelect, id)} key={id}>
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
      var selected = this.props.selected ? <i className="glyphicon glyphicon-ok"></i> : '';
      return <div>
        {this.props.data.id + ' (' + values.year_from + ' - ' + values.year_to + ')'}
      </div>
    }

  });

  var PartyOption = React.createClass({

    render: function() {
      var selected = this.props.selected ? <i className="glyphicon glyphicon-ok"></i> : '';
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
  /*$.get('/search/init_data', {}, function(response) {

    /*var filter_view = new FilterView({
      el:               $('#main'),
      ga_data_hash:     response.ga_data_hash,
      parties_mps_hash: response.parties_mps_hash,
      mps_name_hash:    response.mps_name_hash
    })

  }.bind(this)); */

  React.render(<SearchControls />, $('#main')[0]);

});