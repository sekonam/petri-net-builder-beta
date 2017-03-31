import React, {
  Component,
  PropTypes,
} from 'react';
import ReactEcharts from 'echarts-for-react';

export default
class EchartCycledDataUpload extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    genData: PropTypes.func.isRequired,
    dataOptions: PropTypes.func.isRequired,
    delay: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.updateGraph = ::this.updateGraph;
  }

  componentDidMount() {
    this.graphic = this.g.getEchartsInstance();
    this.updateGraph();
    this.timerId = setInterval(
      this.updateGraph,
      this.props.delay || 1000
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.deay !== this.props.delay) {
      this.componentWillUnmount();
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  updateGraph() {
    if (this.graphic) {
      const { genData, dataOptions } = this.props;
      const data = genData();
      const options = dataOptions(data);
      this.graphic.setOption(options);
    }
  }

  render() {
    return (
      <ReactEcharts
        option={this.props.options}
        ref={(g) => { this.g = g; }}
      />
    );
  }
}
