import React from 'react';
import {Treebeard} from 'react-treebeard';

import Store from '../core/Store.js';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: props.data
    };
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled){
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    if (toggled) {
      Store.instance[node.type].active(node.id);
    }
    this.setState({ cursor: node });
  }

  render() {
    return (
      <Treebeard data={this.state.tree} onToggle={this.onToggle} />
    );
  }
}
