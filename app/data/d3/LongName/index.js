
import * as d3 from 'd3';
import LongNameData from './data';

const rootNode = document.createElement('div');
let width = 960,
  size = 150,
  padding = 19.5;

const x = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

const y = d3.scaleLinear()
    .range([size - padding / 2, padding / 2]);

const extent = function () {
  return [
    [padding / 2, size - padding / 2],
    [padding / 2, size - padding / 2],
  ];
};

const xAxis = d3.axisBottom(x)
    .ticks(5);

const yAxis = d3.axisLeft(y)
    .ticks(5);

const color = d3.scaleOrdinal(d3.schemeCategory20c);

const data = d3.csvParse(LongNameData);

function buildGraph(data) {
  let domainByTrait = {},
    traits = d3.keys(data[0]).filter((d) => d !== 'species'),
    n = traits.length;

  traits.forEach((trait) => {
    domainByTrait[trait] = d3.extent(data, (d) => +d[trait]);
  });

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  const brush = d3.brush().extent(extent)
      .on('start', brushstart)
      .on('brush', brushmove)
      .on('end', brushend);

  const svg = d3.select(rootNode).append('svg')
      .attr('width', size * n + padding)
      .attr('height', size * n + padding)
    .append('g')
      .attr('transform', `translate(${padding},${padding / 2})`);

  const svgXAxis = svg.selectAll('.x.axis')
      .data(traits);
  svgXAxis.enter().append('g')
      .attr('class', 'x axis')
      .attr('transform', (d, i) => `translate(${(n - i - 1) * size},0)`)
      .each(function (d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });
  svgXAxis.exit().remove();

  const svgYAxis = svg.selectAll('.y.axis')
      .data(traits);
  svgYAxis.enter().append('g')
      .attr('class', 'y axis')
      .attr('transform', (d, i) => `translate(0,${i * size})`)
      .each(function (d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });
  svgYAxis.exit().remove();

  const cell0 = svg.selectAll('.cell')
      .data(cross(traits, traits));
  const cell = cell0.enter().append('g')
      .attr('class', 'cell')
      .attr('transform', (d) => `translate(${(n - d.i - 1) * size},${d.j * size})`)
      .each(plot);

  // Titles for the diagonal.
  cell.filter((d) => d.i === d.j).append('text')
      .attr('x', padding)
      .attr('y', padding)
      .attr('dy', '.71em')
      .text((d) => d.x);

  cell.call(brush);

  cell0.exit().remove();

  function plot(p) {
    const cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append('rect')
        .attr('class', 'frame')
        .attr('x', padding / 2)
        .attr('y', padding / 2)
        .attr('width', size - padding)
        .attr('height', size - padding);

    cell.selectAll('circle')
        .data(data)
      .enter().append('circle')
        .attr('cx', (d) => x(d[p.x]))
        .attr('cy', (d) => y(d[p.y]))
        .attr('r', 3)
        .style('fill', (d) => color(d.species));
  }

  let brushCell;

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
    const e = brush.extent();
    svg.selectAll('circle').classed('hidden', (d) => e[0][0] > d[p.x] || d[p.x] > e[1][0]
          || e[0][1] > d[p.y] || d[p.y] > e[1][1]);
  }

  // If the brush is empty, select all circles.
  function brushend() {
    if (brush.empty()) svg.selectAll('.hidden').classed('hidden', false);
  }

  function cross(a, b) {
    let c = [],
      n = a.length,
      m = b.length,
      i,
      j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({ x: a[i], i, y: b[j], j });
    return c;
  }

  // d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
  return rootNode;
}

export { buildGraph, data as initData };
