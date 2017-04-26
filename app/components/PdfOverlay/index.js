import React, { Component, PropTypes }  from 'react';
import PdfViewer from './PdfViewer';

const A4_RATIO = 210 / 297;

export default
class PdfOverlay extends Component {
  render() {
    const url = "http://108.59.80.90:8081/api/ontology/GetPDF/a64536dd-b58a-4faa-ae0c-036a3ff5ef3e";
    // const url="http://localhost:3000/pdf";
    const width = 300;
    const height = Math.round(width * A4_RATIO);
    return <PdfViewer url={url} />;
  }
}
