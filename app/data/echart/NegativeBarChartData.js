const yAxis = ['周一','周二','周三','周四','周五','周六','周日'];
const data = [
  [200, 170, 240, 244, 200, 220, 210],
  [320, 302, 341, 374, 390, 450, 420],
  [-120, -132, -101, -134, -190, -230, -210]
];
const storage = { data, yAxis };

const getOption = (storage) => ({
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data:['利润', '支出', '收入']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'value'
        }
    ],
    yAxis : [
        {
            type : 'category',
            axisTick : {show: false},
            data : storage.yAxis
        }
    ],
    series : [
        {
            name:'利润',
            type:'bar',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data:storage.data[0]
        },
        {
            name:'收入',
            type:'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true
                }
            },
            data:storage.data[1]
        },
        {
            name:'支出',
            type:'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'left'
                }
            },
            data:storage.data[2]
        }
    ]
});

export { storage, getOption };
