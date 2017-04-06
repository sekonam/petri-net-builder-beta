import React from 'react';
import * as SRD from 'storm-react-diagrams';
import './style.css';

export default
class Sample1 extends React.Component {
  constructor(props) {
    super(props);

    // 1) setup the diagram engine
    const engine = this.engine = new SRD.DiagramEngine();
    engine.registerNodeFactory(new SRD.DefaultNodeFactory());
    engine.registerLinkFactory(new SRD.DefaultLinkFactory());

    const generateNodes = (model, offsetX, offsetY) => {
      // 3-A) create a default node
      const node1 = new SRD.DefaultNodeModel('Node 1', 'rgb(0,192,255)');
      const port1 = node1.addPort(new SRD.DefaultPortModel(false, 'out-1', 'Out'));
      node1.x = 100 + offsetX;
      node1.y = 100 + offsetY;

      // 3-B) create another default node
      const node2 = new SRD.DefaultNodeModel('Node 2', 'rgb(192,255,0)');
      const port2 = node2.addPort(new SRD.DefaultPortModel(true, 'in-1', 'IN'));
      node2.x = 200 + offsetX;
      node2.y = 100 + offsetY;

      // 3-C) link the 2 nodes together
      const link1 = new SRD.LinkModel();
      link1.setSourcePort(port1);
      link1.setTargetPort(port2);

      // 4) add the models to the root graph
      model.addNode(node1);
      model.addNode(node2);
      model.addLink(link1);
    };

    // 2) setup the diagram model
    const model = new SRD.DiagramModel();

    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        generateNodes(model, i * 200, j * 100);
      }
    }

    // 5) load model into engine
    engine.setDiagramModel(model);
  }

  render() {
    // 6) render the diagram!
    return React.createElement(SRD.DiagramWidget, { diagramEngine: this.engine });
  }
}
