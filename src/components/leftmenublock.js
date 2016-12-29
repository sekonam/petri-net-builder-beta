import React from 'react';
import { Button } from 'react-bootstrap';

class LeftMenuElement extends React.Component {
  render() {
    const style = typeof this.props.style == 'string' ? this.props.style : 'default';
    return (
      <li>
        <Button onClick={this.props.clickHandler}
          bsStyle={style} block>
          {this.props.text}
        </Button>
      </li>
    );
  }
}

export default class LeftMenuBlock extends React.Component {
  render() {
    const data =this.props.data,
      buttons = data.length == 0 ? [] : data.map( (text, key) =>
        <LeftMenuElement clickHandler={() => { this.props.editHandler(key) }}
          text={text} key={key} />
      );

    return (
      <div className="left-menu-block">
        <h3>{this.props.caption}</h3>
        <ul className="list-type-style-none">
          {buttons}
          <LeftMenuElement clickHandler={this.props.addHandler}
            text={this.props.addCaption} style='primary' />
        </ul>
      </div>
    );
  }
}
