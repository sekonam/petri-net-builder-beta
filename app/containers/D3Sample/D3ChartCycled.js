import React, {
  Component,
  PropTypes,
} from 'react';

export default
class D3ChartCycled extends Component {
  static propTypes = {
    genData: PropTypes.func.isRequired,
    createChart: PropTypes.func.isRequired,
    delay: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.updateGraph = ::this.updateGraph;
  }

  componentDidMount() {
    if (this.svg) {
      this.draw = this.props.createChart(this.svg);
      this.updateGraph();
      this.timerId = setInterval(
        this.updateGraph,
        this.props.delay || 1000
      );
    }
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
    if (this.draw) {
      const data = this.props.genData();
      this.draw(data);
    }
  }

  render() {
    return (
      <svg
        width="960"
        height="500"
        ref={(svg) => { this.svg = svg; }}>
      </svg>
    );
  }
}
