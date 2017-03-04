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
import EchartExamples from '../../components/EchartExamples';

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
            <NavItem eventKey={1} href="cpn_builder">CPN Builder</NavItem>
            <NavDropdown eventKey={3} title="Echat Examples" id="basic-nav-dropdown">
              {EchartExamples.map(
                (example, key) => (<MenuItem
                  eventKey={`3-${key}`}
                  href={example.route}
                  key={`3-${key}`}>
                  {example.label}
                </MenuItem>)
              )}
            </NavDropdown>
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
