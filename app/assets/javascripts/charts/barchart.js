var barChart = {};

barChart.initialize = function(el, opts) {

  var new_chart = {};

  // Global params
  new_chart.el           = el;
  new_chart.width        = opts.width;
  new_chart.height       = opts.height;
  new_chart.yAxisLabel   = opts.yAxisLabel;
  new_chart.xValKey      = opts.xValKey;
  new_chart.yValKey      = opts.yValKey;
  new_chart.yTickFormat  = opts.yTickFormat;
  // Formatting functions
  new_chart.formatXVal    = opts.formatXVal ? opts.formatXVal : function(x) { return x };
  new_chart.formatYVal    = opts.formatYVal ? opts.formatYVal : function(y) { return y };

  var margin = {top: 20, right: 80, bottom: 100, left: 50};
  new_chart.width = new_chart.width - margin.left - margin.right;
  new_chart.height = new_chart.height - margin.top - margin.bottom;

  new_chart.x = d3.scale.ordinal()
      .rangeRoundBands([0, new_chart.width], .1);

  new_chart.y = d3.scale.linear()
      .range([new_chart.height, 0]);

  new_chart.xAxis = d3.svg.axis()
      .scale(new_chart.x)
      .orient("bottom");

  new_chart.yAxis = d3.svg.axis()
      .scale(new_chart.y)
      .orient("left")
      .ticks(10);

  if (f = new_chart.yTickFormat) {
    new_chart.yAxis.tickFormat(d3.format(f));
  }

  new_chart.tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .direction('n')
      .html(function(d) {
        return "<span>" + d.x_val + ":</span> <strong>" + d.y_val + "</strong>";
      });

  var svg = d3.select(el).append("svg")
      .attr("width", new_chart.width + margin.left + margin.right)
      .attr("height", new_chart.height + margin.top + margin.bottom)
    .append("g")
      .attr("class", "barchart")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(new_chart.tip);

  new_chart = _.extend(_.clone(this), new_chart);
  new_chart.render([]);
  return new_chart;

};

barChart.render = function(data, rollCurtain) {
  var self = this;
  var color = d3.scale.category10();
  var x_vals = _.map(data, function(d) { return d.x_val; });

  color.domain(x_vals);

  this.x.domain(x_vals);
  this.y.domain([0, d3.max(data, function(d) { return d.y_val; })]);

  var svg = d3.select(this.el).select(".barchart");

  // X axis
  if (svg.selectAll(".x.axis")[0].length < 1) {
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis)
  } else {
    svg.selectAll(".x.axis")
      .transition()
        .duration(1500)
        .call(this.xAxis)
      .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .style("text-anchor", "end");
  }

  // Y axis
  if (svg.selectAll(".y.axis")[0].length < 1) {
    svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis)
      .append("text")
        .attr("transform", "rotate(-90) translate(0, -45)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(this.yAxisLabel);
  } else {
    svg.selectAll(".y.axis")
      .transition()
        .duration(1500)
        .call(this.yAxis);
  }

  // Bars
  var bar = svg.selectAll(".bar")
      .data(data, function(d) { return d.x_val; })

  bar.transition()
      .delay(400)
      .duration(1500)
      .attr("y", function(d) { return self.y(d.y_val); })
      .attr("height", function(d) { return self.height - self.y(d.y_val); })
      .attr("x", function(d) { return self.x(d.x_val); })
      .attr("width", this.x.rangeBand())

  bar.enter().append("rect")
      .attr("class", "bar")
      .attr("fill", function(d) { return color(d.x_val); })
      .attr("x", function(d) { return self.x(d.x_val); })
      .attr("y", this.height) // Starting at bottom (d3 starts y coord from top left)
      .attr("height", 0)
      .attr("width", this.x.rangeBand())
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide)
    .transition()
      .duration(1500)
      .attr("y", function(d) { return self.y(d.y_val); })
      .attr("height", function(d) { return self.height - self.y(d.y_val); })

  bar.exit()
    .transition()
      .duration(400)
      .attr("y", this.height)
      .attr("x", function(d) { return self.x(d.x_val); })
      .attr("height", 0)
      .remove();
};

barChart.process_data = function(data) {
  return data.map(function(d) {
    return {
      x_val: this.formatXVal(d.get(this.xValKey)),
      y_val: this.formatYVal(d.get(this.yValKey))
    }
  }, this).toJS();
};

barChart.parseDate = function(date) {
  return moment(date, this.datetimeformat).toDate();
};

barChart.remove = function() {
  $(this.el).remove();
};