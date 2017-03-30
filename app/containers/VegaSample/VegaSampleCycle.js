import React, {
  Component,
  PropTypes,
} from 'react';
import VegaContainer from './VegaContainer';

export default
class VegaSampleCycle extends Component {
  static propTypes = {
    spec: PropTypes.object.isRequired,
    genData: PropTypes.func.isRequired,
    delay: PropTypes.number,
    renderer: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.updateGraph = ::this.updateGraph;
  }

  componentDidMount() {
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
    if (this.vega) {
      const data = this.props.genData();
      this.vega.updateData(data);
    }
  }

  render() {
    return (
      <VegaContainer
        spec={this.props.spec}
        renderer={this.props.renderer || 'canvas'}
        ref={(vega) => { this.vega = vega; }}
      />
    );
  }
}
