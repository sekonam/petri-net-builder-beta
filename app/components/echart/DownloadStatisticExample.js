import React from 'react';
import DownloadStatistic from '../../modules/echart/components/DownloadStatistic';
import DownloadStatisticModel from '../../modules/echart/models/DownloadStatisticModel';

export default function DownloadStatisticExample() {
  const builderJson = {
    all: 10887,
    charts: {
      map: 3237,
      lines: 2164,
      bar: 7561,
      line: 7778,
      pie: 7355,
      scatter: 2405,
      candlestick: 1842,
      radar: 2090,
      heatmap: 1762,
      treemap: 1593,
      graph: 2060,
      boxplot: 1537,
      parallel: 1908,
      gauge: 2107,
      funnel: 1692,
      sankey: 1568,
    },
    components: {
      geo: 2788,
      title: 9575,
      legend: 9400,
      tooltip: 9466,
      grid: 9266,
      markPoint: 3419,
      markLine: 2984,
      timeline: 2739,
      dataZoom: 2744,
      visualMap: 2466,
      toolbox: 3034,
      polar: 1945,
    },
    ie: 9743,
  };

  const downloadJson = {
    'echarts.min.js': 17365,
    'echarts.simple.min.js': 4079,
    'echarts.common.min.js': 6929,
    'echarts.js': 14890,
  };

  const themeJson = {
    'dark.js': 1594,
    'infographic.js': 925,
    'shine.js': 1608,
    'roma.js': 721,
    'macarons.js': 2179,
    'vintage.js': 1982,
  };

  const data = {
    chart: builderJson.charts,
    component: builderJson.components,
    download: downloadJson,
    theme: themeJson,
  };
  const points = [0, 2000, 4000, 6000, 8000, 10000];
  const model = new DownloadStatisticModel(data, points);

  return (<DownloadStatistic
    title="Download Statistic Example"
    model={model}
    builderAll={builderJson.all}
  />);
}
