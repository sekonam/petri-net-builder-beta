import React, { PropTypes } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

import Query from '../core/Query';
import Store from '../core/Store';

export default function SocketList(props) {
  const { data } = props;
  const methods = Store.instance;
  const query = Query.instance;
  const sockets = {
    income: [],
    outcome: [],
  };

  data.forEach((sid, key) => {
    const socket = query.socket.get(sid);
    sockets[socket.typeName].push(
      <FormGroup key={key} className="padding-xxx-small-vertical">
        <div className="row">
          <div className="col-xs-11">
            <FormControl
              type="text" value={socket.name}
              onChange={(e) => methods.socket.set(socket.id, { name: e.target.value })}
            />
          </div>
          <div className="col-xs-1 text-center">
            <Button
              onClick={() => methods.socket.remove(socket.id)}
              className="btn-box-tool" bsStyle="link"><i className="fa fa-trash"></i></Button>
          </div>
        </div>
      </FormGroup>
    );
  });

  return (
    <div>
      <br />
      <h5>Income Sockets
      <Button
        onClick={() => methods.socket.addForm({ type: 0 })}
        className="btn-box-tool pull-right text-green">+ Add</Button></h5>
      {sockets.income}
      <br />
      <h5>Outcome Sockets
      <Button
        onClick={() => methods.socket.addForm({ type: 1 })}
        className="btn-box-tool pull-right text-green">+ Add</Button></h5>
      {sockets.outcome}
    </div>
  );
}

SocketList.propTypes = {
  data: PropTypes.array.isRequired,
};
