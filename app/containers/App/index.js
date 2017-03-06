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
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Realine, sekonam</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
          </Nav>
          <Nav pullRight>
            <LinkContainer to="/cpn_builder">
              <NavItem eventKey={1}>CPN Builder</NavItem>
            </LinkContainer>
            <LinkContainer to="/echarts">
              <NavItem eventKey={2}>Echart Examples</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container">
        {React.Children.toArray(props.children)}
      </div>
    </AppWrapper>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
