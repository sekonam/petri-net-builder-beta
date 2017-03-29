import * as d3 from 'd3';

const rootNode = document.createElement('div');
let width = 960,
  height = 500,
  padding = 1.5, // separation between same-color circles
  clusterPadding = 6, // separation between different-color circles
  maxRadius = 12;

let n = 200, // total number of circles
  m = 10; // number of distinct clusters

const color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(m));

// The largest node for each cluster.
const clusters = new Array(m);

const nodes = d3.range(n).map(() => {
  let i = Math.floor(Math.random() * m),
    r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
    d = { cluster: i, radius: r };
  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  return d;
});

const force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0.02)
    .charge(0)
    .on('tick', tick)
    .start();

const svg = d3.select(rootNode).append('svg')
    .attr('width', width)
    .attr('height', height);

function buildGraph(nodes) {
  const circle0 = svg.selectAll('circle')
    .data(nodes);
  const circle = circle0
  .enter().append('circle')
    .attr('r', (d) => d.radius)
    .style('fill', (d) => color(d.cluster))
    .call(force.drag);

  circle0.exit().remove();

  function tick(e) {
    circle
      .each(cluster(10 * e.alpha * e.alpha))
      .each(collide(0.5))
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  }

// Move d to be adjacent to the cluster node.
  function cluster(alpha) {
    return function (d) {
      const cluster = clusters[d.cluster];
      if (cluster === d) return;
      let x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
      if (l != r) {
        l = (l - r) / l * alpha;
        d.x -= x *= l;
        d.y -= y *= l;
        cluster.x += x;
        cluster.y += y;
      }
    };
  }

// Resolves collisions between d and all other circles.
  function collide(alpha) {
    const quadtree = d3.geom.quadtree(nodes);
    return function (d) {
      let r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
      quadtree.visit((quad, x1, y1, x2, y2) => {
        if (quad.point && (quad.point !== d)) {
          let x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }
  return rootNode;
}

export { buildGraph, nodes as initData };
