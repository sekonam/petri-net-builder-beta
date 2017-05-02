import { isEmpty } from 'lodash';
import React, { Component, PropTypes } from 'react';
import md5 from 'blueimp-md5';
import { PDFJS as pdfjs } from 'pdfjs-dist/web/pdf_viewer';
import https from 'https';
import http from 'http';

import Pagination from 'react-js-pagination';
import { Button } from 'react-bootstrap';

import 'pdfjs-dist/web/pdf_viewer.css';
import './PdfViewer.scss';

const DEFAULT_SCALE = 1;

pdfjs.disableWorker = true;

export default
class PdfViewer extends Component {
  static propTypes = {
    pdfId: PropTypes.string.isRequired,
    pageNum: PropTypes.number,
  };

  static defaultProps = {
    pageNum: 1,
  };

  constructor(props) {
    super(props);
    this.state = {
      pageNum: props.pageNum,
      pdf: null,
      relations: [],
    };
    this.getRelations = :: this.getRelations;
    this.handlePageChange = :: this.handlePageChange;
  }

  componentDidMount() {
    const { pdfId } = this.props;
    // Fetch the PDF document.
    pdfjs.getDocument(`http://108.59.80.90:8081/api/ontology/GetPDF/${pdfId}`).then(
      (pdf) => {
        this.setState({ pdf });
      },
      console.log,
    );
  }


  componentDidUpdate() {
    if (this.state.pdf) {
      const { pageNum, pdf } = this.state;
      if (pdf && pageNum >= 1 && pageNum <= pdf.numPages) {
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
//              annotationLayerFactory: new pdfjs.DefaultAnnotationLayerFactory(),
            });

            // Associates the actual page with the view, and drawing it
            pdfPageView.setPdfPage(page);
            return pdfPageView.draw();
          }
        );
      }
    }
  }

  getSelection() {
    if (window.getSelection) { // IE8+ or other
      const selection = window.getSelection();

      if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        const text = range.startContainer.parentNode.innerHTML;
        return {
          selection: text.substring(range.startOffset, range.endOffset).trim(),
          line: text,
        };
      }

      return null;
    }
    // IE8-
    // const selection = document.selection;
    return null;
  }

  getContent(url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
      // select http or https module, depending on reqested url
      const lib = /^https/.test(url) ? https : http;
      const request = lib.get(url, (response) => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
        }
        // temporary data holder
        const body = [];
        // on every content chunk, push it to the data array
        response.on('data', (chunk) => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        response.on('end', () => resolve(body.join('')));
      });
      // handle connection errors of the request
      request.on('error', (err) => reject(err));
    });
  }

  getRelations() {
    if (this.state.pdf) {
      const selectionObj = this.getSelection();

      if (selectionObj) {
        const { selection, line } = selectionObj;
        const lineMd5 = md5(line);
        const { pdfId } = this.props;

        if (selection) {
          this.setState({ loading: true });
          Promise.all([
            this.getContent(`http://108.59.80.90:8081/api/ontology/GetRelations/${selection}?documentId=${pdfId}`),
            this.getContent(`http://108.59.80.90:8081/api/ontology/GetLinesByWord/${selection}?documentId=${pdfId}`),
          ]).then(
            (jsonStrs) => {
              let relations = [];
              const relationsJson = JSON.parse(jsonStrs[0]);
              const linesByWorldJson = JSON.parse(jsonStrs[1]);
              const dataLine = linesByWorldJson.find(
                (ln) => ln.MD5Hash === lineMd5
              );
              if (dataLine) {
                console.log(selection, dataLine.RelatedSentences, relationsJson.map((r) => r.SentenceId));
                relations = relationsJson.filter(
                  (rl) => dataLine.RelatedSentences.indexOf(rl.SentenceId) > -1
                );
              }
              this.setState({ relations, loading: false });
            },
            (err) => {
              console.log(err);
              this.setState({ loading: false });
            },
          );
        }
      }
    }
  }

  handlePageChange(pageNum) {
    this.setState({ pageNum });
  }

  render() {
    const { pageNum, pdf, relations, loading } = this.state;
    const RELATION_FIELDS = [
      'Subject',
      'Relation',
      'Object',
    ];
    const RELATION_NODE_FIELDS = [
      'Position',
      'OriginalText',
      'Lemma',
      'Class',
    ];
    const showReltions = !isEmpty(relations);
    const noRelations = !loading && !showReltions;
    return (
      <div className="pdf-relations-container">
        <div className="pdf-viewer-column">
          {!pdf && <div className="rl-info">Pdf loading...</div>}
          <div
            className="pdf-viewer pdfViewer singlePageView"
            ref={(pageDiv) => { this.pageDiv = pageDiv; }}>
          </div>
          {pdf && <div className="page-scroll">
            <Pagination
              activePage={pageNum}
              itemsCountPerPage={1}
              totalItemsCount={pdf.numPages}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
            />
          </div>}
        </div>
        <div className="pdf-relations-column">
          <Button onClick={this.getRelations}>Get Relations</Button>
          {showReltions && relations.map(
            (relation, relKey) => (
              <div className="relation" key={relKey}>
                <h3>{`${relKey + 1}th relation`}</h3>
                {RELATION_FIELDS.map(
                  (type, typeKey) => (!isEmpty(relation[type]) &&
                    <div className={`relation-${type} relation-type`} key={typeKey}>
                      <h4>{type}</h4>
                        {relation[type].map(
                        (relNode, nodeKey) => (
                          <div className="relation-node" key={nodeKey}>
                            <h5>{`${nodeKey + 1}th item`}</h5>
                            {RELATION_NODE_FIELDS.map(
                              (nodeField, fieldKey) => (
                                <div className="relation-node-field" key={fieldKey}>
                                  <span className="field-name">{nodeField}</span>
                                  <span className="field-value">{relNode[nodeField]}</span>
                                </div>
                              )
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            )
          )}
          {loading && <div className="rl-info">Loading relations</div>}
          {noRelations && <div className="rl-warning">No relations</div>}
        </div>
      </div>
    );
  }
}
