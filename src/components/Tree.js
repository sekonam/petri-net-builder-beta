import React from 'react';
import {Treebeard} from 'react-treebeard';

import Query from '../core/Query.js';
import Store from '../core/Store.js';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = Query.instance.treebreadWorkspace();
    this.toggled = [];
    this.toggleClicked = false;
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.toggleClicked) {
      this.toggleClicked =  false;
    } else {
      const activeId = this.state.cursor ? this.state.cursor.id : null,
        {tree, cursor} = Query.instance.treebreadWorkspace(activeId, this.toggled);
      if (cursor) cursor.active = true;
      this.setState({ tree, cursor });
    }
  }

  onToggle(node, toggled){
    if (node.id) Store.instance[node.type].active(node.id);

    if (node.children) {
      node.toggled = toggled;

      if (toggled) {
        this.toggled.push(node.id);
      } else {
        this.toggled.spliceRecurcive( (id) => id == node.id );
      }
    }

    if (toggled) {
      this.toggleClicked = true;
    }

    if (this.state.cursor) {
      this.state.cursor.active = false;
    }

    node.active = true;

    this.setState({
      cursor: node
    });

  }

  render() {
    return (
      <Treebeard data={this.state.tree} onToggle={this.onToggle} />
    );
  }
}
