import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { ucfirst } from '../core/helpers';

function LeftMenuElement(props) {
  const className = typeof props.className === 'string' ? props.className : 'default';
  return (
    <Button
      onClick={props.clickHandler}
      className={className}>
      {props.text}
    </Button>
  );
}

LeftMenuElement.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default function LeftMenuBlock(props) {
  const { data, itemName } = props;
  const buttons = data
    .map((el, key) =>
      <LeftMenuElement
        clickHandler={() => props.editHandler(el.value)}
        text={el.label}
        key={key}
        className="btn-box-tool text-white padding-medium-vertical margin-small-bottom"
      />
    );

  return (
    <div className="box box-left-side">
      <div className="box-header">
        <h5>{`${ucfirst(itemName)}s`}
          <LeftMenuElement
            clickHandler={() => props.addHandler()}
            text={'+ Add'}
            className="btn-box-tool pull-right text-white"
          />
        </h5>
      </div>
      <div className="box-body no-padding">
        {buttons}
      </div>
    </div>
  );
}

LeftMenuBlock.propTypes = {
  itemName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  editHandler: PropTypes.func.isRequired,
  addHandler: PropTypes.func.isRequired,
  style: PropTypes.string,
};
