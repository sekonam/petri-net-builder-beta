import React from 'react';
import * as SRD from 'storm-react-diagrams';
import './style.css';

const rand = (max) => Math.floor(Math.random() * max);
const randEl = (array) => array[rand(array.length)];

export default
class Sample3 extends React.Component {
  constructor(props) {
    super(props);
    const engine = this.engine = new SRD.DiagramEngine();
    engine.registerNodeFactory(new SRD.DefaultNodeFactory());
    engine.registerLinkFactory(new SRD.DefaultLinkFactory());
    engine.setDiagramModel(this.createDiagram(5, 5));
  }

  createNode(name, color, portCount, offset) {
    const node = new SRD.DefaultNodeModel(name, color);
    for (let i = 0; i < portCount; i += 1) {
      const isInput = Math.random() > 0.5;
      const label = isInput ? 'In' : 'Out';
      const uid = `${label}-${i}`;
      node.addPort(
        new SRD.DefaultPortModel(isInput, uid, uid)
      );
    }
    node.x = offset.x;
    node.y = offset.y;
    return node;
  }

  createLink(node1, node2) {
    const outPorts = node1.getOutPorts();
    const inPorts = node2.getInPorts();

    if (outPorts.length && inPorts.length) {
      const link = new SRD.LinkModel();
      link.setSourcePort(randEl(outPorts));
      link.setTargetPort(randEl(inPorts));
      return link;
    }
  }

  createDiagram(nodeCount, linkCount) {
    const model = new SRD.DiagramModel();

    for (let i = 0; i < nodeCount; i += 1) {
      model.addNode(
        this.createNode(
          `Node sample ${i}`,
          'rgb(0,192,255)',
          7,
          {
            x: rand(800),
            y: rand(600),
          }
        )
      );
    }

    const nodes = Object.values(model.getNodes());

    for (let i = 0; i < linkCount; i += 1) {
      const fromNode = randEl(nodes);
      let toNode;

      do {
        toNode = randEl(nodes);
      } while (toNode.name === fromNode.name);

      model.addLink(this.createLink(fromNode, toNode));
    }

    return model;
  }

  render() {
    // 6) render the diagram!
    const diagram = React.createElement(SRD.DiagramWidget, { diagramEngine: this.engine });
    return (
      <div className="storm-diagram">
        {diagram}
      </div>
    );
  }
}
