const data = [
  [120, 132, 101, 134, 90, 230, 210],
  [220, 182, 191, 234, 290, 330, 310],
  [150, 232, 201, 154, 190, 330, 410],
  [320, 332, 301, 334, 390, 330, 320],
  [820, 932, 901, 934, 1290, 1330, 1320],
];

const axis = ['周一','周二','周三','周四','周五','周六','周日'];

const legend = ['邮件营销','联盟广告','视频广告','直接访问','搜索引擎'];

const storage = { data, axis, legend };

const getOption = (storage) => ({
    title: {
        text: '堆叠区域图'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:storage.legend,
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : storage.axis,
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'邮件营销',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:storage.data[0]
        },
        {
            name:'联盟广告',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:storage.data[1]
        },
        {
            name:'视频广告',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:storage.data[2]
        },
        {
            name:'直接访问',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:storage.data[3]
        },
        {
            name:'搜索引擎',
            type:'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data:storage.data[4]
        }
    ]
});

export { storage, getOption };
