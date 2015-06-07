// Change template syntax to avoid conflicts with erb
_.templateSettings = {
  interpolate: /<&=(.+?)&>/g,
  evaluate: /<&(.+?)&>/g
};

var FilterView = Backbone.View.extend({

  events: {
    'change .selectpicker' : 'filter'
  },

  /*
  Data model:
  general_assemblies_hash = {
    ga_id: {
      parties: [],
      date_from: '',
      date_to:   '',
      mp_ids: []
    }
  }
  parties_x_mp_ids = {
    party: []
  }
  visible_parties = find parties by gas, concat and unique
  visible_mps = mps_by_ga intersect mps_by_parties
  */
  initialize: function(options) {
    _.bindAll(this,
      'render',
      'filter')
    this.filters_template   = _.template($('#filters-template').html());
    this.ga_data_hash       = options.ga_data_hash;
    this.parties_mps_hash   = options.parties_mps_hash;
    this.mps_name_hash      = options.mps_name_hash;
    this.visible_parties    = [];
    this.visible_mp_ids     = [];
    this.build_option_values();
    this.render();
  },

  render: function() {
    var $el = this.$('#searchbar-wrap');
    var filter_html = this.filters_template({
      general_assemblies: this.ga_data_hash,
      parties:            this.visible_parties,
      mp_ids:             this.visible_mp_ids,
      mps_name_hash:      this.mps_name_hash
    });
    $el.after(filter_html);
    // Initialize bootstrap select
    $('.selectpicker').selectpicker();
    // Initialize bootstrap datepicker
    $('#date-from').datetimepicker({
      format: 'YYYY-MM-DD'
    });
    $('#date-to').datetimepicker({
      format: 'YYYY-MM-DD'
    });
  },

  build_option_values: function() {
    var selected_general_assemblies = _.map($('#gas option:selected'), function(opt) {
      return $(opt).val();
    });
    var selected_parties = [];
    var no_ga_selected = selected_general_assemblies.length === 0;
    var mps_by_gas = [];
    var mps_by_parties = [];
    // mps come along for the ride
    this.visible_parties = _.reduce(this.ga_data_hash, function(memo, data, key) {
      if (_.contains(this.selected_general_assemblies, key) || no_ga_selected) {
        mps_by_gas = _.uniq(mps_by_gas.concat(data.mp_ids));
        return _.uniq(memo.concat(data.parties))
      }
    }, [], this);

    if (selected_parties.length > 0) {
      var mps_by_parties = _.reduce(this.visible_parties, function(memo, party) {
        return _.uniq(memo.concat(this.parties_mps_hash[party]))
      }, [], this);
      this.visible_mp_ids = _.intersection(mps_by_gas, mps_by_parties);
    } else {
      this.visible_mp_ids = mps_by_gas;
    }
  },

  filter: function() {
    this.build_option_values();
    this.render();
  }

});