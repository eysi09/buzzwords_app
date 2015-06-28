// values for y-axis are indicated by 'y_val'
// values for x-axis are indicated by 'date' and should be date strings
// lines are grouped together by 'name'
// opts include:
//    width (int)
//    height (int)
//    datetimeformat (string): For parsing datestrings and converting to JS date objects
//    date_key (string): For finding the date string in the data
//    y_axis_label (string)
//    dp: Dataprocessor
//    load_key (string or array): For getting data from data processor
//    y_tick_format (string) [optional]: For formatting y axis values. See d3 tickformat documentation
//    is_processed (boolean): [optional]: If true, skips data processing (Note: data must be sorted if processing is skipped)
//    format_date (function) [optional]: Formats date for tooltip
//    format_name (function) [optional]: Formats name for tooltip and legend
//    format_y_val (function) [optional]: Formats y value for tooltip and axis

var timeseriesChart = {};

timeseriesChart.create = function(el, opts) {

  var new_chart = {}

  // Global params
  new_chart.el             = el;
  new_chart.width          = opts.width;
  new_chart.height         = opts.height;
  new_chart.datetimeformat = opts.datetimeformat;
  new_chart.date_key       = opts.date_key;
  new_chart.y_axis_label   = opts.y_axis_label;
  new_chart.y_tick_format  = opts.y_tick_format;
  new_chart.roll_curtain   = opts.roll_curtain;
  // Formatting functions
  var format_date       = opts.format_date ? opts.format_date : function(d) { return d};
  var format_y_val      = opts.format_y_val ? opts.format_y_val : function(v) { return v};
  new_chart.format_name      = opts.format_name ? opts.format_name : function(n) { return n};

  var self = new_chart;

  var margin = {top: 20, right: 80, bottom: 30, left: 50};
  new_chart.width = new_chart.width - margin.left - margin.right;
  new_chart.height = new_chart.height - margin.top - margin.bottom;

  new_chart.x = d3.time.scale()
      .range([0, new_chart.width]);

  new_chart.y = d3.scale.linear()
      .range([new_chart.height, 0]);

  new_chart.xAxis = d3.svg.axis()
      .scale(new_chart.x)
      .orient("bottom");

  new_chart.yAxis = d3.svg.axis()
      .scale(new_chart.y)
      .orient("left");

  if (f = new_chart.y_tick_format) {
    new_chart.yAxis.tickFormat(d3.format(f));
  }

  new_chart.line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return new_chart.x(d.date); })
      .y(function(d) { return new_chart.y(d.y_val); });

  /*new_chart.tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([0, 10])
      .direction("e")
      .html(function(d) {
        var date = format_date(d.date);
        var html = "<span class='date'>" + date + "</span>";
        _.each(d, function(val, key) {
          if (key !== 'date') {
            var name = self.format_name(key);
            var y_val = format_y_val(val);
            html += "<br><span>" + name + ":  </span><strong>" + y_val + "</strong>";
          }
        })
        return html;
      });*/

  var svg = d3.select(el).append("svg")
      .attr("width", new_chart.width + margin.left + margin.right)
      .attr("height", new_chart.height + margin.top + margin.bottom)
    .append("g")
      .attr("class", "timeseries")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(new_chart.tip);

  new_chart = _.extend(_.clone(this), new_chart);
  new_chart.render();
  return new_chart;

},

timeseriesChart.render = function(data) {
  var self = this;
  var color = d3.scale.category10();
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== 'date'; }));

  // Group and count
  var line_data = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        var val = d[name] || 0
        return {
          date: d.date, y_val: +val, name: name}; // Store name for accessing color for points on line
      })
    };
  });

  //var end_date = moment().add(1, 'days').startOf('day').toDate();
  //this.x.domain([data[0].date, end_date]); // Dates are ordered
  this.x.domain(d3.extent(data, function(d) { return d.date; }));
  this.y.domain([0, d3.max(line_data, function(d) { return d3.max(d.values, function(v) { return v.y_val; }); })
  ]);

  var svg = d3.select(this.el).select(".timeseries");

  // X axis
  if (svg.selectAll(".x.axis")[0].length < 1) {
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis);
  } else {
    svg.selectAll(".x.axis")
      .transition()
        .duration(1500)
        .call(this.xAxis);
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
        .text(this.y_axis_label);
  } else {
    svg.selectAll(".y.axis")
      .transition()
        .duration(1500)
        .call(this.yAxis);
  }

  // Lines
  var lineGroup = svg.selectAll(".line-group")
      .data(line_data, function(d) { return d.name })

  var onLineGroupEnter = lineGroup.enter().append("g")
      .attr("class", "line-group")

  onLineGroupEnter.append("path")
      .attr("class", "line");

  // Update (must come before enter() for enter() transition delay to work)
  lineGroup.select("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .transition()
      .duration(1500)
      .attr("transform", function(d) { return "translate(" + self.x(d.value.date) + "," + self.y(d.value.y_val) + ")"; })

  onLineGroupEnter.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + self.x(d.value.date) + "," + self.y(d.value.y_val) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
    .transition()
      .delay(this.roll_curtain ? 1500 : 0)
      .text(function(d) { return self.format_name(d.name); })

  lineGroup.exit()
    .transition()
      .duration(1500)
      .attr("stroke", "#fff")
      .remove();

  lineGroup.select("path")
      .style("stroke", function(d) { return color(d.name); })
    .transition()
      .duration(1500)
      .attr("d", function(d) { return self.line(d.values); });

  // Points for date
  var points = lineGroup.selectAll("circle")
      .data(function(d) { return d.values })

  // Update (must come before enter() for enter() transition delay to work)
  points.transition().duration(1500)
      .attr("cx", function(d, i) { return self.x(d.date) })
      .attr("cy", function(d, i) { return self.y(d.y_val) });

  points.enter()
      .append("circle")
      .attr("cx", function(d, i) { return self.x(d.date) })
      .attr("cy", function(d, i) { return self.y(d.y_val) })
      .attr("fill", function(d, i) { return color(d.name) })
    .transition()
      .delay(this.roll_curtain ? 1500: 0)
      .attr("r", 3);

  points.exit().remove();

  // Rollback curtain for smooth rendering (only on first render)
  if (this.roll_curtain) {
    var curtain = svg.append('rect')
      .attr('x', -1 * this.width)
      .attr('y', -1 * this.height)
      .attr('height', this.height)
      .attr('width', this.width)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180)')
      .style('fill', '#fff');

    svg.transition()
      .duration(1500)
      .ease('linear')
      .select('rect.curtain')
      .attr('width', 0);

    this.roll_curtain = false;
  }
  
  // Vertical line to show on mouse over (only initalize once)
  if (svg.selectAll('.vertical-line-group')[0].length < 1) {
    var vLineGroup = svg.append("g")
        .attr("class", "vertical-line-group")
        .style("display", "none")

    var vLine = vLineGroup.append("line")
        .attr("class", "vertical-line")
        .style("stroke-width", 2)
        .style("stroke", "gainsboro");

    // Overlay to detect mouse movement
    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", this.width)
        .attr("height", this.height)
        .on("mouseover", function() { vLineGroup.style("display", null); })
        .on("mouseout", function() { vLineGroup.style("display", "none"); self.tip.hide(); });
  } else {
    var vLine = svg.select(".vertical-line");
  }

  svg.select(".overlay")
      .on("mousemove", mousemove);

  // For calculating vLine's position
  /*var bisectDate = d3.bisector(function(d) { return d.date; }).left;

  function mousemove() {
    if (data.length > 1) {
      var x0 = self.x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    } else {
      d = data[0];
    }
    vLine.attr("x1", self.x(d.date));
    vLine.attr("y1", 0);
    vLine.attr("x2", self.x(d.date));
    vLine.attr("y2", self.height);
    self.tip.show(d, vLine[0][0]);
  }*/
},

timeseriesChart.remove = function() {
  $(this.el).remove();
};