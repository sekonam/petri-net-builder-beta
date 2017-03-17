const data = (function (){
    var series = [];
    for (var i = 1; i <= 28; i++) {
        series.push([
          {
            value:[
                (40 - i) * 10,
                (38 - i) * 4 + 60,
                i * 5 + 10,
                i * 9,
                i * i /2
            ],
            name: i + 2000 + ''
          }
        ]);
    }
    return series;
})();

const legend = (function (){
    var list = [];
    for (var i = 1; i <=28; i++) {
        list.push(i + 2000 + '');
    }
    return list;
})();

const indicator = [
    { text: 'IE8-', max: 400},
    { text: 'IE9+', max: 400},
    { text: 'Safari', max: 400},
    { text: 'Firefox', max: 400},
    { text: 'Chrome', max: 400}
 ];

const storage = { data, legend, indicator };

const getOption = (storage) => ({
    title: {
        text: '浏览器占比变化',
        subtext: '纯属虚构',
        x:'right',
        y:'bottom'
    },
    tooltip: {
        trigger: 'item',
    },
    legend: {
        data: storage.legend
    },
    radar: {
       indicator : storage.indicator
    },
    series : storage.data.map(
      (data) => ({
        name:'浏览器（数据纯属虚构）',
        type: 'radar',
        symbol: 'none',
        itemStyle: {
            normal: {
                lineStyle: {
                  width:1
                }
            },
            emphasis : {
            }
        },
        data
      })
    )
});

export { storage, getOption };
