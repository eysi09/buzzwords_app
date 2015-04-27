// Change template syntax to avoid conflicts with erb
_.templateSettings = {
  interpolate: /<&=(.+?)&>/g,
  evaluate: /<&(.+?)&>/g
};

var FilterView = Backbone.View.extend({

  events: {
    'change .selectpicker' : 'filter'
  },

  initialize: function(options) {
    _.bindAll(this,
      'render',
      'filter')
    this.filters_template   = _.template($('#filters-template').html());
    this.general_assemblies = options.general_assemblies;
    this.parties            = options.parties;
    this.mps                = options.mps;
    this.render();
  },

  render: function() {
    var $el = this.$('#searchbar-wrap');
    var filter_html = this.filters_template({
      general_assemblies: this.general_assemblies,
      parties:            this.parties,
      mps:                this.mps
    });
    $el.append(filter_html);
    // Initialize bootstrap select
    $('.selectpicker').selectpicker();
  },

  filter: function() {
  }

});