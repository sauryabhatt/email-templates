/** @format */

import React from "react";
import { Row, Col } from "antd";
import Icon from "@ant-design/icons";
import certificationIcon from "../../public/filestore/certificationIcon";

function Certifications(props) {
  let { mobile = false, certificates = [] } = props;
  return (
    <Row className={mobile ? "qa-mar-btm-2" : "qa-mar-btm-3"}>
      {certificates.map((certificate, i) => {
        return (
          <Col
            className={mobile ? "qa-mar-btm-2" : "qa-pad-24 qa-mar-btm-2"}
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            key={i}
          >
            <div className="qa-bg-light-theme">
              <div className="qa-disp-table-cell cert-left-blk">
                <Icon
                  component={certificationIcon}
                  className="certificate-icon"
                />
              </div>
              <div className="qa-disp-table-cell qa-pad-2 cert-right-blk">
                <div className="qa-fw-b qa-text-ellipsis qa-tc-white">
                  {certificate.title}
                </div>
                <div
                  className={
                    mobile
                      ? "qa-text-3line qa-fs-13 qa-min-height"
                      : "qa-text-2line qa-fs-13 qa-min-height"
                  }
                >
                  {certificate.desc}
                </div>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

export default Certifications;
