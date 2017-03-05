import React, {
  Component,
  PropTypes,
} from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import EchartComponent from './EchartComponent';

class EchartTester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.code,
    };
    this.state.options = this.checkCode();
    this.setCode = ::this.setCode;
    this.setOptions = ::this.setOptions;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Object.is(nextState.options, this.state.options);
  }

  setCode(code) {
    this.setState({ code });
  }

  setOptions() {
    const options = this.checkCode();

    if (options) {
      this.setState({ options });
    }
  }

  checkCode() {
    const { code } = this.state;

    if (code) {
      let options;
      let option;
      eval(code);
      return options || option;
/*      const codeFunction = new Function(`${code};
        return options || option;`);
      return codeFunction();*/
    }

    return null;
  }

  render() {
    const Container = styled.div`
      height: 100%;
    `;
    const Left = styled.div`
      float: left;
      width: 58%;
      margin-right: 2%;
    `;
    const Right = styled.div`
      float:right;
      width:38%
      margin-left: 2%;
    `;
    const CenterBtn = styled.div`
      margin-top: 5px;
      text-align: center;
    `;

    return (<Container>
      <Left>
        <EchartComponent options={this.state.options || {}} />
      </Left>
      <Right>
        <CodeMirror
          value={this.state.code || ''}
          onChange={this.setCode}
          options={{
            lineNumbers: true,
            mode: 'javascript',
          }}
        />
        <CenterBtn>
          <Button onClick={this.setOptions}>Submit</Button>
        </CenterBtn>
      </Right>
    </Container>);
  }
}

EchartTester.propTypes = {
  code: PropTypes.string,
};

export default EchartTester;

export function EchartTesterSample() {
  return (<EchartTester
    code={`options = {
    title: {
        text: '自定义雷达图'
    },
    legend: {
        data: ['图一','图二', '张三', '李四']
    },
    radar: [
        {
            indicator: [
                { text: '指标一' },
                { text: '指标二' },
                { text: '指标三' },
                { text: '指标四' },
                { text: '指标五' }
            ],
            center: ['25%', '50%'],
            radius: 120,
            startAngle: 90,
            splitNumber: 4,
            shape: 'circle',
            name: {
                formatter:'【{value}】',
                textStyle: {
                    color:'#72ACD1'
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(114, 172, 209, 0.2)',
                    'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                    'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.5)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.5)'
                }
            }
        },
        {
            indicator: [
                { text: '语文', max: 150 },
                { text: '数学', max: 150 },
                { text: '英语', max: 150 },
                { text: '物理', max: 120 },
                { text: '化学', max: 108 },
                { text: '生物', max: 72 }
            ],
            center: ['75%', '50%'],
            radius: 120
        }
    ],
    series: [
        {
            name: '雷达图',
            type: 'radar',
            itemStyle: {
                emphasis: {
                    // color: 各异,
                    lineStyle: {
                        width: 4
                    }
                }
            },
            data: [
                {
                    value: [100, 8, 0.40, -80, 2000],
                    name: '图一',
                    symbol: 'rect',
                    symbolSize: 5,
                    lineStyle: {
                        normal: {
                            type: 'dashed'
                        }
                    }
                },
                {
                    value: [60, 5, 0.30, -100, 1500],
                    name: '图二',
                    areaStyle: {
                        normal: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }
                }
            ]
        },
        {
            name: '成绩单',
            type: 'radar',
            radarIndex: 1,
            data: [
                {
                    value: [120, 118, 130, 100, 99, 70],
                    name: '张三',
                    label: {
                        normal: {
                            show: true,

                        }
                    }
                },
                {
                    value: [90, 113, 140, 30, 70, 60],
                    name: '李四',
                    areaStyle: {
                        normal: {
                            opacity: 0.9,
                            color: '#72ACD1',
                        }
                    }
                }
            ]
        }
    ]
}`}
  />);
}
