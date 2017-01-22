import _ from 'lodash';
import React from 'react';
import {Button} from 'react-bootstrap';

import Store from '../core/Store.js';
import Query from '../core/Query.js';
import StorageEngine from '../core/StorageEngine.js';

import EngineModel from '../models/EngineModel.js';
import PlaceModel from '../models/PlaceModel.js';
import GroupModel from '../models/GroupModel.js';
import EventModel from '../models/EventModel.js';
import ActionModel from '../models/ActionModel.js';
import ArcModel from '../models/ArcModel.js';
import VarModel from '../models/VarModel.js';
import SocketModel from '../models/SocketModel.js';
import ViewportModel from '../models/ViewportModel.js';

import Context from './Context.js';
import PlaceForm from './PlaceForm.js';
import GroupForm from './GroupForm.js';
import EventForm from './EventForm.js';
import ActionForm from './ActionForm.js';
import ArcForm from './ArcForm.js';
import VarForm from './VarForm.js';
import LeftMenuBlock from './LeftMenuBlock.js';

export default class Engine extends React.Component {

  constructor(props) {
    super(props);
//    StorageEngine.saveToStorage( 'db', '');
    this.store = new Store( this.setState.bind(this) );
    this.state = this.store.state;
    this.query = new Query( this.state );
  }

  saveStateToStorage() {
    StorageEngine.saveToStorage( 'db', this.state.db );
  }

  keyDownHandler(e) {
    if (e.keyCode == 27 && this.state.active.arc) {
      this.methods.arc.removeActive();
    }
  }

  componentDidMount() {
    window.addEventListener( 'beforeunload', this.saveStateToStorage );
    document.body.addEventListener( 'keydown', this.keyDownHandler);
  }

  componentWillUnmount() {
//    window.removeEventListener( 'beforeunload', this.saveStateToStorage );
    document.body.removeEventListener( 'keydown', this.keyDownHandler);
  }

  render() {
    const
      modal = this.state.modal,
      store = this.state.db,
      methods = this.store,
      query = this.query,
      active = this.state.active,

      leftMenuBlocks = [ 'place', 'group', 'event', 'action', 'var', ].map( (itemType, key) => {
        return (
        <LeftMenuBlock key={key}
          itemName={itemType}
          activeId={itemType == 'place' ? this.state.active.place : ''}
          data={query[itemType].options()}
          editHandler={methods[itemType].edit}
          addHandler={methods[itemType].add}/>
      )});

    return (
      <div className="engine">
        <div className="left-menu">
          {leftMenuBlocks}
        </div>
        <div className="buttons">
          <span>Zoom:</span>
          <Button onClick={ () => methods.zoom.change(-0.1) } bsStyle="default">-</Button>
          <Button onClick={ () => methods.zoom.change(0.1) } bsStyle="default">+</Button>
          <Button onClick={ () => methods.zoom.set(1) } bsStyle="default">Default</Button>
        </div>
        <Context viewport={this.state.viewport}
          methods={methods} active={active} />
        { modal.place ? <PlaceForm show={!_.isEmpty(modal.place)}
          data={modal.place}
          saveHandler={methods.place.save}
          afterEditHandler={methods.place.afterEdit}
          removeHandler={methods.place.remove}
          socketHandlers={methods.socket}/> : '' }
        { modal.event ? <EventForm show={!_.isEmpty(modal.event)}
          data={modal.event}
          saveHandler={methods.event.save}
          afterEditHandler={methods.event.afterEdit}
          removeHandler={methods.event.remove} /> : '' }
        { modal.action ? <ActionForm show={!_.isEmpty(modal.action)}
          data={modal.action}
          events={query.event.options()}
          selectedEvents={query.event.selectedOptions(modal.action ? modal.action.events : [])}
          saveHandler={methods.action.save}
          afterEditHandler={methods.action.afterEdit}
          removeHandler={methods.action.remove} /> : '' }
        { modal.arc ? <ArcForm show={!_.isEmpty(modal.arc)}
          data={modal.arc}
          methods={methods.arc} /> : '' }
        { modal.var ? <VarForm show={!_.isEmpty(modal.var)}
          data={modal.var}
          methods={methods.var} /> : '' }
        { modal.group ? <GroupForm show={!_.isEmpty(modal.group)}
          data={modal.group}
          places={query.place.options()}
          selectedPlaces={query.place.selectedOptions(modal.group ? modal.group.placeIds : [])}
          methods={methods.group} /> : '' }
      </div>
    );
  }

}
