import React from 'react';
import { Treebeard } from 'react-treebeard';

import { indexById, spliceRecurcive } from '../core/helpers';
import { NodeNames, NodeGroupNames } from '../core/Entities';
import Query from '../core/Query';
import Store from '../core/Store';

export default class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.treebreadWorkspace();
    this.toggled = [];
    this.toggleClicked = false;
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillReceiveProps() {
    if (this.toggleClicked) {
      this.toggleClicked = false;
    } else {
      const activeId = this.state.cursor ? this.state.cursor.id : null;
      const {
        tree,
        cursor,
      } = this.treebreadWorkspace(activeId, this.toggled);

      if (cursor) {
        cursor.active = true;
      }

      this.setState({ tree, cursor });
    }
  }

  onToggle(node, toggled) {
    const methods = Store.instance;

    if (node.id) {
      if (node.type === 'net') {
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
        spliceRecurcive(
          this.toggled,
          (id) => id === node.id
        );
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
      cursor: node,
    });
  }

  treebreadWorkspace(activeId = null, toggled = []) {
    const query = Query.instance;
    const s = (name) => `${name}s`;
    let cursor = null;

    const tree = {
      name: 'Workspace',
      toggled: true,
      children: query
        .nets()
        .filter((net) => !net.subnetId)
        .map(
          (net) => {
            const entities = {};

            NodeGroupNames.forEach((entityName) => {
              entities[entityName] = query.state.db[s(entityName)]
                .filter((entity) => entity.netId === net.id);
            });

            const netNode = {
              id: net.id,
              type: 'net',
              name: net.short('name'),
              toggled: toggled.indexOf(net.id) > -1,
              children: entities.group.map((group) => {
                const groupNode = {
                  id: group.id,
                  type: 'group',
                  name: group.short('name'),
                  toggled: toggled.indexOf(group.id) > -1,
                  children: [],
                };

                NodeNames.forEach((entityName) => {
                  groupNode.children = groupNode.children.concat(
                    group[`${entityName}Ids`].map((id) => {
                      const entity = query[entityName].get(id);
                      const key = indexById(entities[entityName], (id));

                      if (key > -1) {
                        entities[entityName].splice(key, 1);
                      }

                      const node = {
                        id: entity.id,
                        type: entityName,
                        name: entity.short('name'),
                      };

                      if (entity.id === activeId) {
                        cursor = node;
                      }

                      return node;
                    })
                  );
                });

                if (group.id === activeId) {
                  cursor = groupNode;
                }

                return groupNode;
              }),
            };

            NodeNames.forEach((entityName) => {
              netNode.children = netNode.children.concat(
                entities[entityName].map((entity) => {
                  const node = {
                    id: entity.id,
                    type: entityName,
                    name: entity.short('name'),
                  };

                  if (entity.id === activeId) {
                    cursor = node;
                  }

                  return node;
                })
              );
            });

            if (net.id === activeId) {
              cursor = netNode;
            }

            return netNode;
          }
        ),
    };

    return {
      tree,
      cursor,
    };
  }

  render() {
    return (
      <Treebeard data={this.state.tree} onToggle={this.onToggle} />
    );
  }
}
