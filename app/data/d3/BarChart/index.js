import * as d3 from 'd3';

const genData = () => {
  const data = [];

  for (
    let i = 'A'.charCodeAt(0);
    i < 'Z'.charCodeAt(0);
    i += 1
  ) {
    data.push({
      letter: String.fromCharCode(i),
      frequency: Math.random() / 8,
    });
  }

  return data;
};

const createChart = (svgElement) => {
  const svg = d3.select(svgElement);
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  svg.selectAll('g.graphic').remove();

  const g = svg.append("g")
    .attr("class", 'graphic')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xAxis = g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")");
  const yAxis = g.append("g")
    .attr("class", "axis axis--y");

  yAxis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Frequency");

  return (data) => {
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y).ticks(10, "%"));

    g.selectAll(".bar").remove();
    const bars = g.selectAll(".bar")
      .data(data);
    bars.enter()
      .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("y", function(d) { return y(d.frequency); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.frequency); });
  };
}

export { genData, createChart };
