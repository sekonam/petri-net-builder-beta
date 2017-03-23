
import * as d3 from 'd3';
import LongNameData from './data';

var rootNode = document.createElement('div');
var width = 960,
    size = 150,
    padding = 19.5;

var x = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scaleLinear()
    .range([size - padding / 2, padding / 2]);

var extent = function () {
  return [
    [padding / 2, size - padding / 2],
    [padding / 2, size - padding / 2],
  ];
};

var xAxis = d3.axisBottom(x)
    .ticks(5);

var yAxis = d3.axisLeft(y)
    .ticks(5);

var color = d3.scaleOrdinal(d3.schemeCategory20c);

var data = d3.csvParse(LongNameData);

function buildGraph(data) {
  var domainByTrait = {},
      traits = d3.keys(data[0]).filter(function(d) { return d !== "species"; }),
      n = traits.length;

  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { return +d[trait]; });

  });

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  var brush = d3.brush().extent(extent)
      .on("start", brushstart)
      .on("brush", brushmove)
      .on("end", brushend);

  var svg = d3.select(rootNode).append("svg")
      .attr("width", size * n + padding)
      .attr("height", size * n + padding)
    .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

  var svgXAxis = svg.selectAll(".x.axis")
      .data(traits);
    svgXAxis.enter().append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });
    svgXAxis.exit().remove();

  var svgYAxis = svg.selectAll(".y.axis")
      .data(traits);
    svgYAxis.enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });
    svgYAxis.exit().remove();

  var cell0 = svg.selectAll(".cell")
      .data(cross(traits, traits));
    var cell = cell0.enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });

  cell.call(brush);

  cell0.exit().remove();

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", function(d) { return x(d[p.x]); })
        .attr("cy", function(d) { return y(d[p.y]); })
        .attr("r", 3)
        .style("fill", function(d) { return color(d.species); });
  }

  var brushCell;

  // Clear the previously-active brush, if any.
  function brushstart(p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.clear());
      x.domain(domainByTrait[p.x]);
      y.domain(domainByTrait[p.y]);
      brushCell = this;
    }
  }

  // Highlight the selected circles.
  function brushmove(p) {
    var e = brush.extent();
    svg.selectAll("circle").classed("hidden", function(d) {
      return e[0][0] > d[p.x] || d[p.x] > e[1][0]
          || e[0][1] > d[p.y] || d[p.y] > e[1][1];
    });
  }

  // If the brush is empty, select all circles.
  function brushend() {
    if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
  }

  function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
  }

  //d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
  return rootNode;
}

export { buildGraph, data as initData };
