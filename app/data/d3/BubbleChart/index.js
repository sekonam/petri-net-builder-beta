import * as d3 from 'd3';
import BubbleChartData from './data';

let rootNode = document.createElement('div'),
  width = 960,
  height = 960;

const svg = d3.select(rootNode).append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('fontFamily', 'sans-serif')
  .attr('fontSize', '10')
  .attr('textAnchor', 'middles');

const format = d3.format(',d');

const color = d3.scaleOrdinal(d3.schemeCategory20c);

const pack = d3.pack()
    .size([width, height])
    .padding(1.5);

const classes = d3.csvParse(BubbleChartData, (d) => {
  d.value = +d.value;
  if (d.value) return d;
});

function buildGraph(classes) {
  const root = d3.hierarchy({ children: classes })
      .sum((d) => d.value)
      .each((d) => {
        if (id = d.data.id) {
          var id,
            i = id.lastIndexOf('.');
          d.id = id;
          d.package = id.slice(0, i);
          d.class = id.slice(i + 1);
        }
      });

  const node0 = svg.selectAll('.node')
    .data(pack(root).leaves());
  const node = node0
    .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

  node.append('circle')
      .attr('id', (d) => d.id)
      .attr('r', (d) => d.r)
      .style('fill', (d) => color(d.package));

  node.append('clipPath')
      .attr('id', (d) => `clip-${d.id}`)
    .append('use')
      .attr('xlink:href', (d) => `#${d.id}`);

  node.append('text')
      .attr('clip-path', (d) => `url(#clip-${d.id})`)
    .selectAll('tspan')
    .data((d) => d.class.split(/(?=[A-Z][^A-Z])/g))
    .enter().append('tspan')
      .attr('x', 0)
      .attr('y', (d, i, nodes) => 13 + (i - nodes.length / 2 - 0.5) * 10)
      .text((d) => d);

  node.append('title')
      .text((d) => `${d.id}\n${format(d.value)}`);

  node0.exit().remove();

  return rootNode;
}

export { buildGraph, classes as initData };
