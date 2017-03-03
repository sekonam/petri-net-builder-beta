import React from 'react';
// import EchartExamples from '../../modules/echart';

export default function Navbar() {
  return (
    <nav className="navbar navbar-default navbar-static-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar"
            aria-expanded="false"
            aria-controls="navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar">1</span>
            <span className="icon-bar">2</span>
            <span className="icon-bar">3</span>
          </button>
          <a className="navbar-brand">Sekonam home (Realine)</a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li><a>CPN builder</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
