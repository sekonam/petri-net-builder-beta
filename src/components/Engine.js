import _ from 'lodash';
import React from 'react';
import {Button} from 'react-bootstrap';

import Store from '../core/Store.js';
import Query from '../core/Query.js';
import StorageEngine from '../core/StorageEngine.js';

import Context from './Context.js';
import PlaceForm from './PlaceForm.js';
import TransitionForm from './TransitionForm.js';
import SubnetForm from './SubnetForm.js';
import GroupForm from './GroupForm.js';
import EventForm from './EventForm.js';
import HandlerForm from './HandlerForm.js';
import ArcForm from './ArcForm.js';
import NetForm from './NetForm.js';
import LeftMenuBlock from './LeftMenuBlock.js';
import Tree from './Tree.js';

export default class Engine extends React.Component {

  constructor(props) {
    super(props);

    this.store = new Store( this.setState.bind(this) );
    this.query = new Query( this.store.state );
    this.state = this.store.state;

    this.saveStateToStorage = this.saveStateToStorage.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
  }

  saveStateToStorage() {
    StorageEngine.saveToStorage( 'db', this.state.db );
  }

  keyDownHandler(e) {
    if (e.keyCode == 27 && this.state.drawing.arc) {
      this.methods.arc.escapeDraw();
    }
  }

  componentDidMount() {
    window.addEventListener( 'beforeunload', this.saveStateToStorage );
    document.body.addEventListener( 'keydown', this.keyDownHandler);
  }

  componentWillUnmount() {
    window.removeEventListener( 'beforeunload', this.saveStateToStorage );
    document.body.removeEventListener( 'keydown', this.keyDownHandler);
  }

  render() {
    const
      form = this.state.form,
      store = this.state.db,
      methods = this.store,
      query = this.query,
      active = this.state.active,

      leftMenuBlocks = [ 'event', 'handler', ].map( (entityType, key) => {
        return (
        <LeftMenuBlock key={key}
          itemName={entityType}
          data={query[entityType].options()}
          editHandler={methods[entityType].edit}
          addHandler={methods[entityType].add}/>
      )});

    let formComp = '';

    switch (form.type) {
      case 'net':
        formComp = <NetForm data={form.data} />;
        break;
      case 'place':
        formComp = <PlaceForm data={form.data} />;
        break;
      case 'transition':
        formComp = <TransitionForm data={form.data}
          handlers={query.handler.options()}
          selectedHandlers={query.handler.selectedOptions(form.data.handlerIds)}
          />;
        break;
      case 'subnet':
        formComp = <SubnetForm data={form.data} />;
        break;
      case 'group':
        formComp = <GroupForm data={form.data}
          places={query.place.options()}
          transitions={query.transition.options()}
          subnets={query.subnet.options()}
          selectedPlaces={query.place.selectedOptions(form.data.placeIds)}
          selectedTransitions={query.transition.selectedOptions(form.data.transitionIds)}
          selectedSubnets={query.subnet.selectedOptions(form.data.subnetIds)} />;
        break;
      case 'arc':
        formComp = <ArcForm data={form.data} />;
        break;
      case 'event':
        formComp = <EventForm data={form.data} />;
        break;
      case 'handler':
        formComp = <HandlerForm data={form.data} events={query.event.options()}
          selectedEvents={query.event.selectedOptions(form.data.events)} />;
        break;
    }

    return (
      <div className="engine">
        <div className="left-menu">
          <h3>Data Structure</h3>
          <Tree ref={(tree) => { this.tree = tree; }} />
          {leftMenuBlocks}
        </div>
        <div className="buttons">
          <span>Add:</span>
          <Button onClick={ () => methods.net.add() } bsStyle="primary">Net</Button>
          <Button onClick={ () => methods.subnet.add() } bsStyle="primary">SubNet</Button>
          <Button onClick={ () => methods.place.add() } bsStyle="primary">Place</Button>
          <Button onClick={ () => methods.transition.add() } bsStyle="primary">Transition</Button>
          <Button onClick={ () => methods.group.add({type: 0}) } bsStyle="primary">Phase</Button>
          <Button onClick={ () => methods.group.add({type: 1}) } bsStyle="primary">Milestone</Button>
          <span>Zoom:</span>
          <Button onClick={ () => methods.zoom.change(-0.1) } bsStyle="default">-</Button>
          <Button onClick={ () => methods.zoom.change(0.1) } bsStyle="default">+</Button>
          <Button onClick={ () => methods.zoom.set(1) } bsStyle="default">Default</Button>
        </div>
        <div className="right-sidebar">
          {formComp}
        </div>
        <Context viewport={this.state.viewport} active={active}
          drawing={this.state.drawing} dragging={this.state.dragging} />
      </div>
    );
  }

}
