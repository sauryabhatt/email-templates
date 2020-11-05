/** @format */

import React, { useRef } from "react";
import { Collapse } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

const Panel = Collapse.Panel;

function Accordion(props) {
  let {
    accordionView = "",
    keys = ["1", "2"],
    setActiveKey,
    accData = {},
  } = props;
  let {
    colorCustomizationAvailable = "",
    sizeCustomizationAvailable = "",
    packagingCustomizationAvailable = "",
    colorCustomizationHeader = "",
    packagingCustomizationHeader = "",
    sizeCustomizationHeader = "",
    customizationHeader = "",
    colorCustomizations = {},
    sizeCustomizations = {},
    packagingCustomizations = {},
    customizationsPackaging = [],
    customizationsSizes = [],
    customizationsColors = [],
    info = {},
    productionDescription = "",
    materialDescription = "",
    sizeDescription = "",
    feature1 = "",
    feature2 = "",
    disclaimer = "",
    height = "",
    lbhUnit = "",
    leastCubeVolume = "",
    length = "",
    breadth = "",
    careDescription = "",
    shadeName = "",
    weight = "",
    packType = "",
    weightUnit = "",
    values = "",
    contents = "",
    hiddenDetail = "",
    articleId = "",
  } = accData || {};
  const custom = useRef();
  const color = useRef();
  const size = useRef();
  const packaging = useRef();

  if (accordionView === "custom" && custom && custom.current) {
    custom.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else if (accordionView === "color" && color && color.current) {
    color.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else if (accordionView === "size" && size && size.current) {
    size.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else if (accordionView === "packaging" && packaging && packaging.current) {
    packaging.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const callback = (key) => {
    setActiveKey(key);
  };

  let specifications = Object.keys(info)
    .sort()
    .map((key) => {
      let value = info[key] ? info[key].toString().trim() : "";

      if (value.length > 0 && key !== "size") {
        // let valueSC =
        //   value.toLowerCase().charAt(0).toUpperCase() +
        //   value.toLowerCase().slice(1);
        let splitKey = key.split(/(?=[A-Z])/).join(" ");

        let keyName =
          splitKey.toLowerCase().charAt(0).toUpperCase() +
          splitKey.toLowerCase().slice(1);
        return (
          <div key={key} className="qa-flex">
            <div className="ps-left-blk qa-text-ellipsis">{keyName}</div>
            <div className="ps-right-blk qa-text-ellipsis">{value}</div>
          </div>
        );
      } else {
        return null;
      }
    });
  let customColors = Object.keys(colorCustomizations).map(function (key, i) {
    let imageUrl =
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
      colorCustomizations[key];
    let colorName =
      key.toLowerCase().charAt(0).toUpperCase() + key.toLowerCase().slice(1);
    let styleName = "odd";
    if (i % 2 === 0) {
      styleName = "even";
    }
    return (
      <div className={`p-box ${styleName}`} key={key}>
        <div className="aspect-ratio-box">
          <img src={imageUrl} alt="Not found" />
        </div>
        <div className="p-custom-size-stitle qa-text-ellipsis">{colorName}</div>
      </div>
    );
  });
  let customPackaging = Object.keys(packagingCustomizations).map(function (
    key,
    i
  ) {
    let imageUrl =
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
      packagingCustomizations[key];
    let colorName =
      key.toLowerCase().charAt(0).toUpperCase() + key.toLowerCase().slice(1);
    let styleName = "odd";
    if (i % 2 === 0) {
      styleName = "even";
    }
    return (
      <div className={`p-box ${styleName}`} key={key}>
        <div className="aspect-ratio-box">
          <img src={imageUrl} alt="Not found" />
        </div>
        <div className="p-custom-size-stitle qa-text-ellipsis">{colorName}</div>
      </div>
    );
  });
  return (
    <div>
      <Collapse
        bordered={false}
        activeKey={keys}
        expandIconPosition="right"
        onChange={callback}
        expandIcon={({ isActive }) => (
          <span>{isActive ? <UpOutlined /> : <DownOutlined />}</span>
        )}
      >
        {productionDescription && (
          <Panel header="How it's made" key="1">
            <div className="qa-pad-0-20">{productionDescription}</div>
          </Panel>
        )}
        <Panel header="Product specifications" key="2">
          <div className="qa-pad-0-20">
            {materialDescription && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">
                  Material description
                </div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {materialDescription}
                </div>
              </div>
            )}
            {careDescription && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">
                  Care description
                </div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {careDescription}
                </div>
              </div>
            )}
            {sizeDescription && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">
                  Size description
                </div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {sizeDescription}
                </div>
              </div>
            )}
            {specifications}
            {feature1 && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Feature 1</div>
                <div className="ps-right-blk qa-text-ellipsis">{feature1}</div>
              </div>
            )}
            {feature2 && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Feature 2</div>
                <div className="ps-right-blk qa-text-ellipsis">{feature2}</div>
              </div>
            )}
            {hiddenDetail && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">
                  Hidden detail
                </div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {hiddenDetail}
                </div>
              </div>
            )}
            {length > 0 && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Length</div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {length} {lbhUnit}
                </div>
              </div>
            )}
            {breadth > 0 && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Breadth</div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {breadth} {lbhUnit}
                </div>
              </div>
            )}
            {height > 0 && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Height</div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {height} {lbhUnit}
                </div>
              </div>
            )}
            {weight > 0 && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Weight</div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {weight} {weightUnit}
                </div>
              </div>
            )}
            {disclaimer && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Disclaimer</div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {disclaimer}
                </div>
              </div>
            )}
            {values && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Values</div>
                <div className="ps-right-blk qa-text-ellipsis">
                  {values.join(", ")}
                </div>
              </div>
            )}
            {packType && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Pack type</div>
                <div className="ps-right-blk qa-text-ellipsis">{packType}</div>
              </div>
            )}
            {contents && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">
                  Pack contents
                </div>
                <div className="ps-right-blk qa-text-ellipsis">{contents}</div>
              </div>
            )}

            {articleId && (
              <div className="qa-flex">
                <div className="ps-left-blk qa-text-ellipsis">Item id</div>
                <div className="ps-right-blk qa-text-ellipsis">{articleId}</div>
              </div>
            )}
          </div>
          <div ref={custom}></div>
        </Panel>
        {(colorCustomizationAvailable ||
          sizeCustomizationAvailable ||
          packagingCustomizationAvailable) && (
          <Panel header="Customization Available" key="3">
            <div className="qa-pad-0-20">{customizationHeader}</div>
            <div>
              {colorCustomizationAvailable && (
                <div ref={color}>
                  <div className="acc-sub-title">
                    Color/Print/Pattern/Material
                  </div>
                  <div className="qa-pad-0-20 qa-stitle">
                    {colorCustomizationHeader}
                  </div>
                  {customizationsColors.toString().trim().length > 0 && (
                    <ul className="qa-pad-0-20 qa-stitle qa-mar-lft15">
                      {customizationsColors.map((item, i) => {
                        return <li key={i}>{item}</li>;
                      })}
                    </ul>
                  )}
                  {customColors}
                </div>
              )}
              {colorCustomizationAvailable && (
                <div className="p-section-divider"></div>
              )}
              {sizeCustomizationAvailable && (
                <div ref={size}>
                  <div className="acc-sub-title">Size/Shape/Form</div>
                  <div className="qa-pad-0-20 qa-stitle">
                    {sizeCustomizationHeader}
                  </div>
                  {customizationsSizes.toString().trim().length > 0 && (
                    <ul className="qa-pad-0-20 qa-stitle qa-mar-lft15">
                      {customizationsSizes.map((item, i) => {
                        return <li key={i}>{item}</li>;
                      })}
                    </ul>
                  )}
                </div>
              )}
              {sizeCustomizationAvailable && (
                <div className="p-section-divider"></div>
              )}
              {packagingCustomizationAvailable && (
                <div ref={packaging}>
                  <div className="acc-sub-title">Packaging</div>
                  <div className="qa-pad-0-20 qa-stitle">
                    {packagingCustomizationHeader}
                  </div>
                  {customizationsPackaging.toString().trim().length > 0 && (
                    <ul className="qa-pad-0-20 qa-stitle qa-mar-lft15">
                      {customizationsPackaging.map((item, i) => {
                        return <li key={i}>{item}</li>;
                      })}
                    </ul>
                  )}
                  {customPackaging}
                </div>
              )}
            </div>
          </Panel>
        )}
      </Collapse>
    </div>
  );
}

export default Accordion;
