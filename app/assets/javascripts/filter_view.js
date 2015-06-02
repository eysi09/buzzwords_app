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
    this.general_assemblies_hash = options.general_assemblies;
    this.mps_name_hash      = options.mps_name_hash;
    this.visible_mp_ids = null;
    this.visible_parties = null;
    this.selected_general_assemblies = [];
    this.selected_parties = [];
    this.selected_mps = [];
    this.build_option_values();
    this.render();
  },

  render: function() {
    var $el = this.$('#searchbar-wrap');
    var filter_html = this.filters_template({
      general_assemblies: this.general_assemblies,
      parties:            this.parties,
      mps:                this.mps
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
    this.visible_parties = [];
    this.visble_mps = [];
    _.each(this.data_hash, function(d) {
      if (_.contains(this.selected_general_assemblies], d.general_assembly_id) {
        this.visible_parties.push(d.party)
      }
    }, this);

  },

  filter: function() {
  }

});