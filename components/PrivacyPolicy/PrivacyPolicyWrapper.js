/** @format */

import React, { Component } from "react";
import { Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Spinner from "./../Spinner/Spinner";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export class PrivacyPolicy extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    disablePrev: true,
    disableNext: false,
    width: null,
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    if (numPages === 0) {
      this.setState({ numPages, disablePrev: true, disableNext: true });
    } else if (numPages === 1) {
      this.setState({ numPages, disablePrev: true, disableNext: true });
    } else if (numPages === 2) {
      this.setState({ numPages, disablePrev: true, disableNext: false });
    } else {
      this.setState({ numPages });
    }
  };
  goToPrevPage = () => {
    if (this.state.numPages === 1) {
      this.setState((state) => ({ disablePrev: true, disableNext: true }));
    } else if (this.state.numPages > 1 && this.state.pageNumber - 1 === 1) {
      this.setState((state) => ({
        pageNumber: state.pageNumber - 1,
        disablePrev: true,
        disableNext: false,
      }));
    } else if (this.state.numPages > 1 && this.state.pageNumber - 1 > 1) {
      this.setState((state) => ({
        pageNumber: state.pageNumber - 1,
        disablePrev: false,
        disableNext: false,
      }));
    }
  };

  goToNextPage = () => {
    if (this.state.numPages === 1) {
      this.setState((state) => ({ disablePrev: true, disableNext: true }));
    } else if (
      this.state.numPages > 1 &&
      this.state.pageNumber + 1 === this.state.numPages
    ) {
      this.setState((state) => ({
        pageNumber: state.pageNumber + 1,
        disablePrev: false,
        disableNext: true,
      }));
    } else if (
      this.state.numPages > 1 &&
      this.state.pageNumber + 1 < this.state.numPages
    ) {
      this.setState((state) => ({
        pageNumber: state.pageNumber + 1,
        disablePrev: false,
        disableNext: false,
      }));
    }
  };

  componentDidMount() {
    this.setState({ width: this.pdfWrapper.getBoundingClientRect().width });
  }

  render() {
    const { pageNumber, numPages, width } = this.state;

    return (<>
      <div>
        <div id="banner-container-privacy" style={{marginTop:"-70px"}}>
          <span className="banner-text">
            Privacy policy
            <p className="banner-text-small">The fine print.</p>
          </span>
        </div>
        <div id="banner-container-privacy-body">
          <div id="pdfWrapper" ref={(ref) => (this.pdfWrapper = ref)}>
            <Document
              className="react-pdf__Page"
              file="/Privacy Policy _WD_v2_2509.pdf"
              onLoadSuccess={this.onDocumentLoadSuccess}
              // renderMode='svg'
              loading={<Spinner />}
              error="Failed to load document please reload the page."
            >
              <Page pageNumber={pageNumber} width={width} />
            </Document>

            <div className="tnc-footer">
              <p>
                {pageNumber} / {numPages}
              </p>
              <div>
                <Button
                  style={{ opacity: "0.7" }}
                  disabled={this.state.disablePrev}
                  onClick={this.goToPrevPage}
                >
                  <ArrowLeftOutlined />
                </Button>
                <Button
                  style={{ opacity: "0.7" }}
                  disabled={this.state.disableNext}
                  onClick={this.goToNextPage}
                >
                  <ArrowRightOutlined />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);
  }
}

export default PrivacyPolicy;
