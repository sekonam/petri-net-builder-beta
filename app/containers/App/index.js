/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const AppWrapper = styled.div`
  max-width: 100%;
  margin: 0;
  display: flex;
  min-height: 100%;
  padding: 0;
  flex-direction: column;
`;

export function App(props) {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - Realine React Boilerplate"
        defaultTitle="Realine React Boilerplate"
        meta={[
          { name: 'description', content: 'Realine React Boilerplate application' },
        ]}
      />
      {React.Children.toArray(props.children)}
    </AppWrapper>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
