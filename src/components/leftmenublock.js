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
    const {data, itemName, activeId} = this.props,
      buttons = data.cmap( (el,key) =>
        <LeftMenuElement clickHandler={() => { this.props.editHandler(el.value) }}
          text={el.label} key={key} style={activeId === el.value ? 'info' : 'default'} />
      );
    return (
      <div className="left-menu-block">
        <h3>{itemName.ucfirst() + 's'}</h3>
        <ul className="list-type-style-none">
          {buttons}
          <LeftMenuElement clickHandler={this.props.addHandler}
            text={'Add ' + itemName} style='primary' />
        </ul>
      </div>
    );
  }
}
