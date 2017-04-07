import React from 'react';
import * as SRD from 'storm-react-diagrams';
import './style.css';

const DefaultColor = 'rgb(0,192,255)';

export default
class Sample4 extends React.Component {
  constructor(props) {
    super(props);

    const engine = this.engine = new SRD.DiagramEngine();
    engine.registerNodeFactory(new SRD.DefaultNodeFactory());
    engine.registerLinkFactory(new SRD.DefaultLinkFactory());

    this.model = new SRD.DiagramModel();
    const color = 'rgb(0,192,255)';

    const address = this.createPort(false, 'address');
    const postalAddress = this.createPort(true, 'postalAddress');
    const phisicalAddress = this.createPort(true, 'phisicalAddress');
    const contactDetailsOut = this.createPort(false, 'contactDetails');
    const contactDetailsIn = this.createPort(true, 'contactDetails');
    const userOut = this.createPort(false, 'user');
    const userIn = this.createPort(true, 'user');
    const orgOut = this.createPort(false, 'org');
    const orgIn = this.createPort(true, 'org');
    const organization = this.createPort(true, 'organization');
    const typeOut = this.createPort(false, 'type');
    const typeIn = this.createPort(true, 'type');

    this.createNode(
      'Create Address',
      color,
      Array.prototype.concat(
        this.createPorts({
          id: true,
          city: true,
          street: true,
          province: true,
          postal: true,
        }),
        address,
      ),
      {
        x: 100,
        y: 250,
      }
    );

    this.createNode(
      'Create Contact Details',
      color,
      Array.prototype.concat(
        this.createPorts({
          email: true,
          cell: true,
          tell: true,
          fax: true,
        }),
        [
          postalAddress,
          phisicalAddress,
          contactDetailsOut,
        ],
      ),
      {
        x: 300,
        y: 100,
      }
    );

    this.createNode(
      'Create User',
      color,
      Array.prototype.concat(
        this.createPorts({
          name: true,
          surname: true,
          middle: true,
          dob: true,
          orgProfile: true,
        }),
        [
          contactDetailsIn,
          userOut,
        ],
      ),
      {
        x: 550,
        y: 100,
      }
    );

    this.createNode(
      'Create Organization Profile',
      color,
      Array.prototype.concat(
        [
          userIn,
          orgIn,
          typeIn,
        ],
        this.createPorts({
          code: true,
          profile: false,
        }),
      ),
      {
        x: 750,
        y: 250,
      }
    );

    this.createNode(
      'Create Organization',
      color,
      Array.prototype.concat(
        this.createPorts({
          name: true,
          descr: true,
          vat: true,
          contactDetails: true,
        }),
        [
          orgOut,
        ],
      ),
      {
        x: 300,
        y: 400,
      }
    );

    this.createNode(
      'Create Organization Type',
      color,
      Array.prototype.concat(
        this.createPorts({
          name: true,
        }),
        [
          organization,
          orgOut,
        ],
      ),
      {
        x: 550,
        y: 400,
      }
    );

    this.createLink(address, postalAddress);
    this.createLink(address, phisicalAddress);
    this.createLink(contactDetailsOut, contactDetailsIn);
    this.createLink(userOut, userIn);
    this.createLink(orgOut, organization);
    this.createLink(orgOut, orgIn);
    this.createLink(typeOut, typeIn);

    engine.setDiagramModel(this.model);
  }

  createNode(name, color, ports, offset) {
    const node = new SRD.DefaultNodeModel(name, color || DefaultColor);
    ports.forEach(:: node.addPort);
    node.x = offset.x;
    node.y = offset.y;
    if (this.model) this.model.addNode(node);
    return node;
  }

  createLink(portOut, portIn) {
    const link = new SRD.LinkModel();
    link.setSourcePort(portOut);
    link.setTargetPort(portIn);
    if (this.model) this.model.addLink(link);
    return link;
  }

  createPort(isInput, label) {
    return new SRD.DefaultPortModel(isInput, label);
  }

  createPorts(portsData) {
    const keys = Object.keys(portsData);
    const values = Object.values(portsData);
    const ports = [];

    for (let i = 0; i < keys.length; i += 1) {
      ports.push(
        this.createPort(
          values[i],
          keys[i],
        )
      );
    }

    return ports;
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
