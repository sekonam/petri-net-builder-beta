import React, { Component, PropTypes }  from 'react';
import styled from 'styled-components';
import pdfjs from 'pdf.js/build/dist/build/pdf';
import Pagination from 'react-js-pagination';
import './style.css';

const DEFAULT_SCALE = 1;

pdfjs.PDFJS.disableWorker = true;
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
      this.renderPage();
    }
  }

  handlePageChange(pageNum) {
    this.setState({ pageNum });
  }

  renderPage() {
    const { pageNum, pdf } = this.state;
    if (pdf && 1 <= pageNum && pageNum <= pdf.numPages) {
      pdf.getPage(pageNum).then(
        (page) => {
          const viewport = page.getViewport(DEFAULT_SCALE);
          return page.getOperatorList().then(
            (opList) => {
              const svgGfx = new pdfjs.SVGGraphics(page.commonObjs, page.objs);
              return svgGfx.getSVG(opList, viewport).then(
                (svg) => {
                  const pdfSvg = document.getElementById('pdf-svg');
                  while (pdfSvg.firstChild) {
                    pdfSvg.removeChild(pdfSvg.firstChild);
                  }
                  pdfSvg.appendChild(svg);
                }
              );
            }
          );
        }
      );
    }
  }

  render() {
    const { width, height } = this.props;
    const { pageNum, pdf } = this.state;
    const PdfViewerContainer = styled.div`
      width: ${width};
      height: ${height};
    `;
    return (
      <div style={{ width }}>
        <PdfViewerContainer id="pdf-svg"></PdfViewerContainer>
        <div className="page-scroll">
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
