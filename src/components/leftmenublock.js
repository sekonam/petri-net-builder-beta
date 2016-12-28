import React from 'react';
import { Button } from 'react-bootstrap';

class LeftMenuElement extends React.Component {
  render() {
    return (
      <li>
        <Button onClick={this.props.clickHandler}>{this.props.text}</Button>
      </li>
    );
  }
}

export default class LeftMenuBlock extends React.Component {
  render() {
    const data =this.props.data,
      buttons = data.length == 0 ? [] : data.map( (element, key) =>
        <LeftMenuElement clickHandler={() => { this.props.editHandler(element) }} text={element.name} key={key} />
      );

    return (
      <div className="left-menu-block">
        <h3>{this.props.caption}</h3>
        <ul className="list-type-style-none">
          {buttons}
          <LeftMenuElement clickHandler={this.props.addHandler} text={this.props.addCaption} />
        </ul>
      </div>
    );
  }
}
