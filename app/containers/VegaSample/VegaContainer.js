import React, {
  Component,
  PropTypes,
} from 'react';
import * as vega from 'vega';

export default
class VegaContainer extends Component {
  static propTypes = {
    spec: PropTypes.object.isRequired,
    renderer: PropTypes.string.isRequired,
    data: PropTypes.object,
  };

  componentDidMount() {
    this.init();
    const { data } = this.props;
    if (data) {
      this.updateData(data);
    }
  }

  componentDidUpdate() {
    this.init();
  }

  componentWillUnmount() {
    if (this.view) {
      this.view.finalize();
    }
  }

  init() {
    if (this.vega) {
      this.view = new vega.View(
        vega.parse(
          this.props.spec
        )
      )
        .renderer(this.props.renderer)  // set renderer (canvas or svg)
        .initialize(this.vega)          // initialize view within parent DOM container
        .hover();                       // enable hover encode set processing
    }
  }

  update() {
    const { view } = this;
    if (view) {
      const { data } = this;
      const names = Object.keys(data);
      names.forEach(
        (name) => {
          const value = data[name];
          view.change(
            name,
            vega
              .changeset()
              .remove(() => true)
              .insert(value),
          );
        }
      );
      view.run();
    }
  }

  updateData(data) {
    this.data = data;
    this.update();
  }

  render() {
    return (
      <div
        ref={(v) => { this.vega = v; }}
      />
    );
  }
}
