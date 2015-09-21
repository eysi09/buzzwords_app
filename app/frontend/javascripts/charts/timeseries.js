var d3            = require('d3');
var moment        = require('moment');
d3.tip            = require('d3-tip');
var D3Timeseries  = {};

D3Timeseries.initalize = function(el, opts) {

  var newChart = {}
  // Global params
  newChart.el           = el;
  newChart.width        = opts.width;
  newChart.height       = opts.height;
  newChart.dateKey      = opts.dateKey;
  newChart.yAxisLabel   = opts.yAxisLabel;
  newChart.yTickFormat  = opts.yTickFormat;
  // Formatting functions
  newChart.formatName = opts.formatName ? opts.formatName : function(n) { return n};
  newChart.formatYVal = opts.formatYVal ? opts.formatName : function(n) { return n};
  newChart.formatDate = opts.formatDate ? opts.formatName : function(n) { return moment(n).format('DD-MM-YYYY')};


  var self = newChart;

  var margin = {top: 20, right: 80, bottom: 30, left: 50};
  newChart.width = newChart.width - margin.left - margin.right;
  newChart.height = newChart.height - margin.top - margin.bottom;

  newChart.x = d3.time.scale()
      .range([0, newChart.width]);

  newChart.y = d3.scale.linear()
      .range([newChart.height, 0]);

  newChart.xAxis = d3.svg.axis()
      .scale(newChart.x)
      .orient("bottom");

  newChart.yAxis = d3.svg.axis()
      .scale(newChart.y)
      .orient("left");

  if (f = newChart.yTickFormat) {
    newChart.yAxis.tickFormat(d3.format(f));
  }

  newChart.line = d3.svg.line()
      .interpolate("cardinal")
      .x(function(d) { return newChart.x(d.date); })
      .y(function(d) { return newChart.y(d.y_val); });

  newChart.tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-150, 10])
      .direction("e")
      .html(function(d) {
        var date = self.formatDate(d.date);
        var html = "<span class='date'>" + date + "</span>";
        _.each(d, function(val, key) {
          if (key !== 'date') {
            var name = self.formatName(key);
            var y_val = self.formatYVal(val);
            html += "<br><span>" + name + ":  </span><strong>" + y_val + "</strong>";
          }
        })
        return html;
      });

  var svg = d3.select(el).append("svg")
      .attr("width", newChart.width + margin.left + margin.right)
      .attr("height", newChart.height + margin.top + margin.bottom)
    .append("g")
      .attr("class", "timeseries")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(newChart.tip);

  newChart = _.extend(_.clone(this), newChart);
  newChart.render([]);
  return newChart;

},

D3Timeseries.render = function(data, rollCurtain) {
  var self = this;
  var color = d3.scale.category10();
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== 'date'; }));

  // Group and count
  var lineData = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        var val = d[name] || 0
        return {
          date: d.date, y_val: +val, name: name}; // Store name for accessing color for points on line
      })
    };
  });

  this.x.domain(d3.extent(data, function(d) { return d.date; })).nice(d3.time.day);
  this.y.domain([0, d3.max(lineData, function(d) { return d3.max(d.values, function(v) { return v.y_val; }); })
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
        .text(this.yAxisLabel);
  } else {
    svg.selectAll(".y.axis")
      .transition()
        .duration(1500)
        .call(this.yAxis);
  }

  // Lines
  // Change data id for nicer transition!
  var lineGroup = svg.selectAll(".line-group")
      .data(lineData, function(d) { return d.name })

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
      .delay(rollCurtain ? 1700 : 0)
      .text(function(d) { return self.formatName(d.name); })

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
      .delay(rollCurtain ? 1700 : 0)
      .attr("r", 3);

  points.exit().remove();

  // Rollback curtain for smooth rendering (only on first render)
  if (rollCurtain) {
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
  var bisectDate = d3.bisector(function(d) { return d.date; }).left;

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
  }
},

D3Timeseries.remove = function() {
  $(this.el).remove();
};

module.exports = D3Timeseries;