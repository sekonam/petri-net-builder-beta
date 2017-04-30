import React, { Component, PropTypes }  from 'react';
import styled from 'styled-components';
// import pdfjs from 'pdf.js/build/dist/build/pdf';
import { PDFJS as pdfjs } from 'pdf.js/build/dist/web/pdf_viewer';
import Pagination from 'react-js-pagination';
import md5 from 'blueimp-md5';
import 'pdf.js/build/dist/web/pdf_viewer.css';

const DEFAULT_SCALE = 1;
const PDF_KEY = 'a64536dd-b58a-4faa-ae0c-036a3ff5ef3e';

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
    this.getRelations = :: this.getRelations;
    this.handlePageChange = :: this.handlePageChange;
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

  getSelection() {
    if (window.getSelection) { // IE8+ or other
      const selection = window.getSelection();

      if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        const text = range.startContainer.parentNode.innerHTML;
        return {
          selection: text.substring(range.startOffset),
          line: text,
        };
      }

      return null;
    }
    // IE8-
    const selection = document.selection;
    return null;
  }

  getContent(url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
      // select http or https module, depending on reqested url
      const lib = /^https/.test(url) ? require('https') : require('http');
      const request = lib.get(url, (response) => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load page, status code: ' + response.statusCode));
        }
        // temporary data holder
        const body = [];
        // on every content chunk, push it to the data array
        response.on('data', (chunk) => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        response.on('end', () => resolve(body.join('')));
      });
      // handle connection errors of the request
      request.on('error', (err) => reject(err))
    });
  }

  getRelations(word) {
    if (this.state.pdf) {
      const { selection, line } = this.getSelection();
      const lineMd5 = md5(line);
      console.log(line, lineMd5);

      if (selection) {
        Promise.all([
          this.getContent(`http://108.59.80.90:8081/api/ontology/GetRelations/problem?documentId=${PDF_KEY}`),
          this.getContent(`http://108.59.80.90:8081/api/ontology/GetLinesByWord/problem?documentId=${PDF_KEY}`),
        ]).then(
          (jsonStrs) => {
            const getRelations = JSON.parse(jsonStrs[0]);
            const getLinesByWorld = JSON.parse(jsonStrs[1]);
            const wordsInLine = getLinesByWorld.filter(
              (lineByWorld) => lineByWorld.MD5Hash === lineMd5
            );
            console.log(wordsInLine);
          },
          console.log,
        );
      }
    }
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
        <div className="page-scroll" onClick={this.getRelations}>
          {pdf && <Pagination
            activePage={pageNum}
            itemsCountPerPage={1}
            totalItemsCount={pdf.numPages}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange}
          />}
        </div>
      </div>
    );
  }
}
