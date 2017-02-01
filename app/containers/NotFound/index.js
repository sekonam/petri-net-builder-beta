/**
 * NotFound
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */
import React from 'react';
import H1 from 'components/H1';

const NotFound = () => (
  <H1>
    Page is not found!
  </H1>
);

export default NotFound;
