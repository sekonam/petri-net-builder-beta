import React, { Component, PropTypes }  from 'react';
import styled from 'styled-components';
// import pdfjs from 'pdf.js/build/dist/build/pdf';
import { PDFJS as pdfjs } from 'pdf.js/build/dist/web/pdf_viewer';
import Pagination from 'react-js-pagination';
import 'pdf.js/build/dist/web/pdf_viewer.css';

const DEFAULT_SCALE = 1;

pdfjs.disableWorker = true;
//pdfjs.PDFJS.workerSrc = '../../../node_modules/pdf.js/build/dist/build/pdf.worker.js';
//pdfjs.PDFJS.cMapUrl = '../node_modules/pdf.js/build/dist/bcmaps/';
//pdfjs.PDFJS.cMapPacked = true;

export default
class PdfViewer extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    pageNum: PropTypes.number,
  };

  static defaultProps = {
    width: 210 * 3 + 'px',
    height: 297 * 3 + 'px',
    pageNum: 1,
  };

  constructor(props) {
    super(props);
    this.state = {
      pageNum: props.pageNum,
      pdf: null,
    };
  }

  componentDidMount() {
    // Fetch the PDF document.
    pdfjs.getDocument(this.props.url).then(
      (pdf) => {
        this.setState({ pdf });
      },
      console.log,
    );
  }

  componentDidUpdate() {
    if (this.state.pdf) {
      const { pageNum, pdf } = this.state;
      if (pdf && 1 <= pageNum && pageNum <= pdf.numPages) {
        pdf.getPage(pageNum).then(
          (page) => {
            const container = this.pageDiv;
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }

            const pdfPageView = new pdfjs.PDFPageView({
              container,
              id: pageNum,
              scale: DEFAULT_SCALE,
              defaultViewport: page.getViewport(DEFAULT_SCALE),
              // We can enable text/annotations layers, if needed
              textLayerFactory: new pdfjs.DefaultTextLayerFactory(),
              annotationLayerFactory: new pdfjs.DefaultAnnotationLayerFactory(),
            });
            
            // Associates the actual page with the view, and drawing it
            pdfPageView.setPdfPage(page);
            return pdfPageView.draw();
          }
        );
      }
    }
  }

  handlePageChange(pageNum) {
    this.setState({ pageNum });
  }

  getSelectionText() {
    let txt = '';
    if (window.getSelection) { // Не IE, используем метод getSelection
      txt = window.getSelection();
    } else { // IE, используем объект selection
      txt = document.selection.createRange().text;
    }
    return txt;
  }

  render() {
    const { width, height } = this.props;
    const { pageNum, pdf } = this.state;
    return (
      <div style={{ width }}>
        <div
          style={{ width, height }}
          className="pdfViewer singlePageView"
          ref={(pageDiv) => { this.pageDiv = pageDiv; }}>
        </div>
        <div className="page-scroll" onClick={() => console.log(this.getSelectionText())}>
          {pdf && <Pagination
            activePage={pageNum}
            itemsCountPerPage={1}
            totalItemsCount={pdf.numPages}
            pageRangeDisplayed={5}
            onChange={::this.handlePageChange}
          />}
        </div>
      </div>
    );
  }
}
