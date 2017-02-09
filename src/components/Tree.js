import React from 'react';
import {Treebeard} from 'react-treebeard';

import {NodeNames, NodeGroupNames} from '../core/Entities.js';
import Query from '../core/Query.js';
import Store from '../core/Store.js';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.treebreadWorkspace();
    this.toggled = [];
    this.toggleClicked = false;
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.toggleClicked) {
      this.toggleClicked =  false;
    } else {
      const activeId = this.state.cursor ? this.state.cursor.id : null,
        {tree, cursor} = this.treebreadWorkspace(activeId, this.toggled);
      if (cursor) cursor.active = true;
      this.setState({ tree, cursor });
    }
  }

  onToggle(node, toggled){
    const methods = Store.instance;

    if (node.id) {
      if (node.type == 'net') {
        methods.net.current(node.id);
        methods.net.edit(node.id);
      } else {
        methods[node.type].active(node.id);
      }
    }

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

  treebreadWorkspace(activeId = null, toggled = []) {
    const query = Query.instance,
      s = (name) => name + 's';

    let cursor = null;
    const node = {
      name: 'Workspace',
      toggled: true,
      children: query.nets().filter( (net) => !net.subnetId ).map( (net) => {
        let entities = {};

        NodeGroupNames.forEach( (entityName) => {
          entities[entityName] = query.state.db[ s(entityName) ]
            .filter( (entity) => entity.netId == net.id );
        } );

        const node = {
          id: net.id,
          type: 'net',
          name: net.short('name'),
          toggled: toggled.indexOf(net.id) > -1,
          children: entities.group.map( (group) => {

            const node = {
              id: group.id,
              type: 'group',
              name: group.short('name'),
              toggled: toggled.indexOf(group.id) > -1,
              children: []
            };

            NodeNames.forEach( (entityName) => {
              node.children = node.children.concat(
                group[entityName + 'Ids'].map( (id) => {
                  const entity = query[entityName].get(id),
                    key = entities[entityName].indexById(id);

                  if (key > -1) {
                    entities[entityName].splice(key, 1);
                  }

                  const node = {
                    id: entity.id,
                    type: entityName,
                    name: entity.short('name')
                  };

                  if (entity.id == activeId) {
                    cursor = node;
                  }

                  return node;
                } )
              );
            } );

            if (group.id == activeId) {
              cursor = node;
            }

            return node;

          } )
        };

        NodeNames.forEach( (entityName) => {
          node.children = node.children.concat(
            entities[entityName].map( (entity) => {

              const node = {
                id: entity.id,
                type: entityName,
                name: entity.short('name')
              };

              if (entity.id == activeId) {
                cursor = node;
              }

              return node;
            } )
          );
        } );

        if (net.id == activeId) {
          cursor = node;
        }

        return node;
      } )
    };

    return {tree: node, cursor};
  }
}
