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

import EchartsRoutes from '../../EchartsRoutes';

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
            <LinkContainer to="/cpn-builder">
              <NavItem eventKey={1}>CPN Builder</NavItem>
            </LinkContainer>
            <NavDropdown eventKey={3} title="Echarts" id="basic-nav-dropdown">
              {EchartsRoutes.map(
                (conf, key) => (
                  <LinkContainer to={`/${conf.route}`} key={key}>
                    <MenuItem eventKey={`2.${key}`}>{conf.label}</MenuItem>
                  </LinkContainer>
                )
              )}
            </NavDropdown>
            <LinkContainer to="/all-charts">
              <NavItem eventKey={2}>All Charts</NavItem>
            </LinkContainer>
            <NavDropdown eventKey={6} title="Vega charts" id="basic-nav-dropdown">
              <LinkContainer to={'/vega-bar-chart'} key={'6.1'}>
                <MenuItem eventKey={'6.1'}>Bar Chart</MenuItem>
              </LinkContainer>
              <LinkContainer to={'/vega-bar-chart-cycle'} key={'6.2'}>
                <MenuItem eventKey={'6.2'}>Multiple Updated(15ms) BarCharts</MenuItem>
              </LinkContainer>
              <LinkContainer to={'/vega-catalog-cycle'} key={'6.3'}>
                <MenuItem eventKey={'6.3'}>Vega Cycled Catalog</MenuItem>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/echart-catalog-cycle">
              <NavItem eventKey={7}>Echart Cycled</NavItem>
            </LinkContainer>
            <LinkContainer to="/d3-catalog-cycle">
              <NavItem eventKey={8}>D3 Cycled</NavItem>
            </LinkContainer>
            <NavDropdown eventKey={9} title="Viva Graphs" id="basic-nav-dropdown">
              <LinkContainer to={'/viva-dinamic'} key={'9.1'}>
                <MenuItem eventKey={'9.1'}>Dinamic Graph</MenuItem>
              </LinkContainer>
              <LinkContainer to={'/viva-gig'} key={'9.2'}>
                <MenuItem eventKey={'9.2'}>Viva Graph Inside Graph</MenuItem>
              </LinkContainer>
              <LinkContainer to={'/viva-tester'} key={'9.3'}>
                <MenuItem eventKey={'9.3'}>Viva Tester</MenuItem>
              </LinkContainer>
            </NavDropdown>
            <NavDropdown eventKey={10} title="Storm Diagram" id="basic-nav-dropdown">
              <LinkContainer to={'/storm-sample-2'} key={'10.1'}>
                <MenuItem eventKey={'10.1'}>First Storm Sample</MenuItem>
              </LinkContainer>
              <LinkContainer to={'/storm-sample-1'} key={'10.2'}>
                <MenuItem eventKey={'10.2'}>Second Storm Sample</MenuItem>
              </LinkContainer>
              <LinkContainer to={'/storm-sample-3'} key={'10.3'}>
                <MenuItem eventKey={'10.3'}>Random Diagram</MenuItem>
              </LinkContainer>
              <LinkContainer to={'/storm-sample-4'} key={'10.4'}>
                <MenuItem eventKey={'10.4'}>Predefined Diagram</MenuItem>
              </LinkContainer>
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
