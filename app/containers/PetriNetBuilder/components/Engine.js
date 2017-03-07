import React from 'react';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import Switch from 'react-bootstrap-switch';

import 'react-select/dist/react-select.css';
import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.css';

import { ucfirst, randStr } from '../core/helpers';
import { NodeNames, NodeTypes } from '../core/Entities';
import Store from '../core/Store';
import Query from '../core/Query';
import StorageEngine from '../core/StorageEngine';

import Context from './Context';
import PlaceForm from './PlaceForm';
import TransitionForm from './TransitionForm';
import SubnetForm from './SubnetForm';
import ExternalForm from './ExternalForm';
import GroupForm from './GroupForm';
import EventForm from './EventForm';
import HandlerForm from './HandlerForm';
import ArcForm from './ArcForm';
import NetForm from './NetForm';
import LeftMenuBlock from './LeftMenuBlock';
import Tree from './Tree';

import logoImage from '../assets/images/realine_logo.png';

export default class Engine extends React.Component {

  constructor(props) {
    super(props);

    this.store = new Store(this.setState.bind(this));
    this.query = new Query(this.store.state);
    this.state = this.store.state;

    this.saveStateToStorage = this.saveStateToStorage.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
  }

  componentWillMount() {
    Query.instance.updateSocketsBySide();
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.saveStateToStorage);
    document.body.addEventListener('keydown', this.keyDownHandler);
  }

  componentWillUpdate() {
    Query.instance.updateSocketsBySide();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveStateToStorage);
    document.body.removeEventListener('keydown', this.keyDownHandler);
  }

  keyDownHandler(e) {
    if (e.keyCode === 27 && this.state.drawing.arc.data) {
      Store.instance.arc.escapeDraw();
    }
  }

  saveStateToStorage() {
    StorageEngine.saveToStorage('db', this.state.db);
  }

  render() {
    const form = this.state.form;
    const methods = this.store;
    const query = this.query;

    const leftMenuBlocks = ['event', 'handler'].map(
      (entityType, key) => <LeftMenuBlock
        key={key}
        itemName={entityType}
        data={query[entityType].options()}
        editHandler={methods[entityType].edit}
        addHandler={methods[entityType].add}
      />
    );

    const switches = NodeNames.map((nodeName) => (
      <div className="margin-xx-small-left display-inline">
        <Switch
          key={nodeName}
          labelText={ucfirst(nodeName)}
          value={query[nodeName].isSelecting()}
          onChange={(el, value) => methods[nodeName].setSelect(value)}
        />
      </div>
      ));

    let topButtons = [
      <Button
        onClick={() => methods.net.add()}
        bsStyle="success"
        className="margin-xx-small-left"
        key={randStr(7)}>
        Net
      </Button>,
    ];

    if (query.net.current()) {
      topButtons = topButtons.concat([
        <Button
          onClick={() => methods.subnet.add()}
          bsStyle="default"
          className="margin-xx-small-left"
          key={randStr(7)}>
          SubNet
        </Button>,

        <Button
          onClick={() => methods.place.add()}
          bsStyle="default"
          className="margin-xx-small-left"
          key={randStr(7)}>
          Place
        </Button>,

        <Button
          onClick={() => methods.transition.add()}
          bsStyle="default"
          className="margin-xx-small-left"
          key={randStr(7)}>
          Transition
        </Button>,

        <Button
          onClick={() => methods.external.add()}
          bsStyle="default"
          className="margin-xx-small-left"
          key={randStr(7)}>
          External Node
        </Button>,

        <Button
          onClick={() => methods.group.add({ type: 0 })}
          bsStyle="default"
          className="margin-xx-small-left"
          key={randStr(7)}>
          Phase
        </Button>,

        <Button
          onClick={() => methods.group.add({ type: 1 })}
          bsStyle="default"
          className="margin-xx-small-left"
          key={randStr(7)}>
          Milestone
        </Button>,
      ]);
    }

    let formComp = null;

    if (form.data) {
      switch (form.type) {
        case 'net':
          formComp = <NetForm data={form.data} />;
          break;
        case 'place':
          formComp = <PlaceForm data={form.data} />;
          break;
        case 'transition':
          formComp = (<TransitionForm
            data={form.data}
            handlers={query.handler.options()}
            selectedHandlers={query.handler.selectedOptions(form.data.handlerIds)}
          />);
          break;
        case 'subnet':
          formComp = <SubnetForm data={form.data} />;
          break;
        case 'external':
          formComp = <ExternalForm data={form.data} />;
          break;
        case 'group':
          formComp = (<GroupForm
            data={form.data}
            places={query.place.options()}
            transitions={query.transition.options()}
            subnets={query.subnet.options()}
            selectedPlaces={query.place.selectedOptions(form.data.placeIds)}
            selectedTransitions={query.transition.selectedOptions(form.data.transitionIds)}
            selectedSubnets={query.subnet.selectedOptions(form.data.subnetIds)}
          />);
          break;
        case 'arc':
          formComp = <ArcForm data={form.data} />;
          break;
        case 'event':
          formComp = <EventForm data={form.data} />;
          break;
        case 'handler':
          formComp = (<HandlerForm
            data={form.data} events={query.event.options()}
            selectedEvents={query.event.selectedOptions(form.data.events)}
          />);
          break;
        default:
          formComp = null;
      }
    }

    return (
      <div className="rl-global-wrapper">
        <div className="rl-main-header">
          <div className="rl-header-content">
            <header className="rl-page-header">
              <nav className="navbar">
                <div className="navbar-header">
                  <a className="navbar-brand" href="/">
                    <img src={logoImage} alt="Realine" />
                  </a>
                </div>
                <div className="pull-right margin">
                  <span className="margin-x-small text-white">Add:</span>
                  {topButtons}
                </div>
              </nav>
            </header>
          </div>
        </div>
        <div className="rl-second-header">
          <div className="rl-header-content">
            <div className="rl-header-content pad">
              <span className="margin-x-small-right">Select:</span>
              {switches}
              <div className="select-inline margin-xx-small-left">
                <Select
                  simpleValue
                  value={this.state.settings.nodeType}
                  options={NodeTypes.map((nodeType) => ({
                    value: nodeType,
                    label: ucfirst(nodeType),
                  }))}
                  onChange={(val) => methods.settings.setNodeType(val)}
                />
              </div>
              <Button
                onClick={() => query.arrangement.set('default')}
                bsStyle="success"
                className="margin-small-left">
                Auto Arrangement
              </Button>
              <Button
                onClick={() => methods.storage.clear()}
                bsStyle="danger"
                className="margin-xx-small-left">
                Clear Storage
              </Button>
            </div>
          </div>
        </div>
        <div className="rl-wrapper">
          <div className="rl-sidebar">
            <div className="relative">
              <div
                className="scroll-section"
                ref={(ref) => {
                  if (ref) {
                    ref.style.right = `${ref.clientWidth - ref.offsetWidth}px`;
                  }
                }}>
                <div className="rl-left-menu">
                  <div className="box box-left-side">
                    <div className="box-header">
                      <h5>Data Structure</h5>
                    </div>
                    <div className="box-body no-padding">
                      <div className="tree-left-menu padding-medium-vertical margin-small-bottom">
                        <Tree ref={(tree) => { this.tree = tree; }} />
                      </div>
                    </div>
                  </div>
                  {leftMenuBlocks}
                </div>
              </div>
            </div>
          </div>
          <div className="rl-main-content">
            <div className="content">
              <div
                className="scroll-section"
                ref={(ref) => {
                  if (ref) {
                    ref.style.right = `${ref.clientWidth - ref.offsetWidth}px`;
                  }
                }}>
                <div className="rl-content">
                  <Context />
                </div>
              </div>
            </div>
          </div>
          <div className="rl-sidebar-right">
            <div className="relative">
              <div
                className="scroll-section"
                ref={(ref) => {
                  if (ref) {
                    ref.style.right = `${ref.clientWidth - ref.offsetWidth}px`;
                  }
                }}>
                <div className="pad">
                  {formComp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
