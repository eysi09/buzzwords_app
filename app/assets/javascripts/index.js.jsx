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
        ga_data_hash:         {},
        parties_mps_hash:     {},
        mps_name_hash:        {},
        selected_gas:         [],
        selected_parties:     [],
        selected_mps:         [],
        visible_parties:      [],
        visible_mp_ids:       [],
        gaSelectExpanded:     false,
        partySelectExpanded:  false,
        mpSelectExpanded:     false,
        results:              []
      };
    },

    componentDidMount: function() {
      $.get('/search/init_data', {}, function(response) {

        this.setState({
          ga_data_hash:     response.ga_data_hash,
          parties_mps_hash: response.parties_mps_hash,
          mps_name_hash:    response.mps_name_hash
        });

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

    filter: function() {

    },

    render: function() {
      return <div className="container">
        <SearchBar onQueryResponse={this.handleQueryResponse}/>
        <div className="row filter-wrap">
          <Select onSelectClick={this.toggleSelectState}
                  name={'gaSelect'}
                  optionCopmonent={<OptionWrap data={{ga_data_hash: this.state.ga_data_hash}} />}
                  isExpanded={this.state['gaSelectExpanded']}
                  />
          <Select onSelectClick={this.toggleSelectState}
                  optionCopmonent={<OptionWrap data={{visible_parties: this.state.visible_parties}} />}
                  name={'partySelect'}
                  isExpanded={this.state['partySelectExpanded']}
                  />
          <Select onSelectClick={this.toggleSelectState}
                  optionComponent={<OptionWrap  data={{visible_mp_ids: this.state.visible_mp_ids, parties_mps_hash: this.state.parties_mps_hash}} />}
                  name={'mpSelect'}
                  isExpanded={this.state['mpSelectExpanded']}
                  />
        </div>
        <Visualizer />
        <SearchResultsTable results={this.state.results}/>
      </div>
    }
  });

  var SearchBar = React.createClass({
    render: function() {
      return (
        <div className="row" id="searchbar-wrap">
          <div className="col-md-9">
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
        self = this;
        $.get('/search/query_server', data, function(response) {
          self.props.onQueryResponse(response.results);
        });
      } else {
        this.props.onQueryResponse([]);
      }
    }
  });

  var Select = React.createClass({

    render: function() {
      var content = this.props.isExpanded ? this.props.optionCopmonent : 'no see';
      return <div className='col-md-3 select' data-name={this.props.name} onClick={this.props.onSelectClick}>
        {content}
      </div>
    }

  });

  var OptionWrap = React.createClass({

    render: function() {
      // For each visible data
      // return <Option />
      return <ul>
      </ul>
    }

  });

  var Option = React.createClass({

    render: function() {
      // On click: select / unselect
      return <li>
      </li>
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
  $.get('/search/init_data', {}, function(response) {

    var filter_view = new FilterView({
      el:               $('#main'),
      ga_data_hash:     response.ga_data_hash,
      parties_mps_hash: response.parties_mps_hash,
      mps_name_hash:    response.mps_name_hash
    })

  }.bind(this));

  React.render(<SearchControls />, $('#main')[0]);

});