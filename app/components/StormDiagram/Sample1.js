import React from 'react';
import * as SRD from "storm-react-diagrams";
import './style.css';

export default
class Sample1 extends React.Component {
  constructor(props) {
    super(props);

    //1) setup the diagram engine
  	this.engine = new SRD.DiagramEngine();
  	this.engine.registerNodeFactory(new SRD.DefaultNodeFactory());
  	this.engine.registerLinkFactory(new SRD.DefaultLinkFactory());

  	//2) setup the diagram model
  	var model = new SRD.DiagramModel();

  	//3-A) create a default node
  	var node1 = new SRD.DefaultNodeModel("Node 1","rgb(0,192,255)");
  	var port1 = node1.addPort(new SRD.DefaultPortModel(false,"out-1","Out"));
  	node1.x = 100;
  	node1.y = 100;

  	//3-B) create another default node
  	var node2 = new SRD.DefaultNodeModel("Node 2","rgb(192,255,0)");
  	var port2 = node2.addPort(new SRD.DefaultPortModel(true,"in-1","IN"));
  	node2.x = 400;
  	node2.y = 100;

  	//3-C) link the 2 nodes together
  	var link1 = new SRD.LinkModel();
  	link1.setSourcePort(port1);
  	link1.setTargetPort(port2);

  	//4) add the models to the root graph
  	model.addNode(node1);
  	model.addNode(node2);
  	model.addLink(link1);

  	//5) load model into engine
  	this.engine.setDiagramModel(model);
  }

  render() {
  	//6) render the diagram!
  	return React.createElement(SRD.DiagramWidget,{diagramEngine: this.engine});
  }
}
