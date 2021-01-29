/** @format */

import React from "react";
import { connect } from "react-redux";
import Icon from "@ant-design/icons";
import {
  Button,
  Row,
  Col,
  Input,
  Form,
  Select,
  Modal,
  Tooltip,
  InputNumber,
  Drawer,
  message,
} from "antd";
import closeButton from "../../public/filestore/closeButton";
import signUp_icon from "../../public/filestore/Sign_Up";
import { loginToApp } from "../AuthWithKeycloak";
import { useRouter } from "next/router";
import { useKeycloak } from "@react-keycloak/ssr";
import getSymbolFromCurrency from "currency-symbol-map";
import { getConvertedCurrency } from "../../utils/currentConverter";

const FreightChargeCalculator = (props) => {
  let { hideCalculationModal, currencyDetails = {} } = props;

  const [calculateform] = Form.useForm();
  const router = useRouter();
  const { keycloak } = useKeycloak();

  const onCalculateCharges = (values) => {
    let { quantity = "", country = "", postalCode = "" } = values || {};
    let a_data = {
      country: country,
      mode: "AIR",
      postalCode: postalCode,
      products: [
        {
          hsnCode: hsnCode,
          casePackLength: parseInt(casePackLength),
          exFactoryPrice: exfactoryListPrice,
          casePackBreadth: parseInt(casePackBreadth),
          casePackWeight: parseInt(casePackWeight),
          casePackHeight: parseInt(casePackHeight),
          casePackQty: parseInt(casePackQty),
          numOfUnits: parseInt(quantity),
          casePackLBHUnit: casePackLBHUnit,
          casePackWeightUnit: casePackWeightUnit,
        },
      ],
    };

    let s_data = { ...a_data, mode: "SEA" };

    fetch(`${process.env.NEXT_PUBLIC_REACT_APP_DUTY_COST_URL}/dutycost`, {
      method: "POST",
      body: JSON.stringify(a_data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while signing up.";
        }
      })
      .then((res) => {
        setAirData(res);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(`${process.env.NEXT_PUBLIC_REACT_APP_DUTY_COST_URL}/dutycost`, {
      method: "POST",
      body: JSON.stringify(s_data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while signing up.";
        }
      })
      .then((res) => {
        setSeaData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div
        onClick={hideCalculationModal}
        style={{
          position: "absolute",
          right: "15px",
          top: "15px",
          cursor: "pointer",
          zIndex: "1",
        }}
      >
        <Icon
          component={closeButton}
          style={{ width: "30px", height: "30px" }}
        />
      </div>
      <div className="heading qa-mar-btm-05">
        Calculate lead time, freight and duties
      </div>
      <div className="qa-mar-btm-2 qa-font-san qa-txt-alg-cnt qa-lh">
        If your country/pincode does not appear in the list below please use
        'Get quote' to send us your order requirements
      </div>

      <Row className="qa-font-san">
        <Col xs={24} sm={24} md={24} lg={6} xl={6} className="frieght-form">
          <Form
            name="calculate_charges_form"
            onFinish={onCalculateCharges}
            form={calculateform}
            scrollToFirstError
          >
            <div>
              <div className="label-paragraph">
                Quantity
                {showPrice &&
                  !(
                    moqList.length > 0 &&
                    smallBatchesAvailable &&
                    (productType !== "RTS" ||
                      (productType === "RTS" && inStock === 0))
                  ) && (
                    <span style={{ float: "right" }}>
                      Minimum{" "}
                      {switchMoq && inStock === 0
                        ? switchMoq
                        : inStock > 0 && inStock < minimumOrderQuantity
                        ? inStock
                        : minimumOrderQuantity}{" "}
                      {moqUnit}
                    </span>
                  )}
              </div>
              <Form.Item
                name="quantity"
                className="form-item"
                rules={[
                  { required: true, message: "Please select quantity" },
                  {
                    min:
                      inStock > 0 && inStock < minimumOrderQuantity
                        ? parseInt(inStock)
                        : parseInt(minimumOrderQuantity),
                    type: "number",
                    message:
                      "Please add quantity equal or greater than the minimum",
                  },
                  {
                    pattern: new RegExp("^[0-9]*$"),
                    message: "Wrong format!",
                  },
                ]}
              >
                {showPrice ? (
                  <InputNumber type="number" className="p-text-box" />
                ) : (
                  <Tooltip
                    trigger={["focus"]}
                    title={qtyError}
                    placement="top"
                    overlayClassName="qa-tooltip qty-tooltip"
                  >
                    <Input value="" className="p-text-box" />
                  </Tooltip>
                )}
              </Form.Item>
            </div>
            <div className="qa-font-san">Select Country</div>
            <Form.Item
              name="country"
              className="form-item"
              rules={[{ required: true, message: "Please select country" }]}
            >
              <Select showSearch dropdownClassName="qa-light-menu-theme">
                {filteredCountry}
              </Select>
            </Form.Item>
            <div className="qa-font-san">Enter destination zip code</div>
            <Form.Item
              name="postalCode"
              rules={[{ required: true, message: "Field is required." }]}
            >
              <Input />
            </Form.Item>
            {nonServiceable && (
              <div className="qa-text-error">
                This zipcode/ pincode doesn't appear in our list. Please use
                'Get quote' to send us your order requirements
              </div>
            )}
            <Button
              className="pincode-check-btn qa-mar-btm-2 qa-mar-top-1"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form>
        </Col>
        <Col xs={24} sm={24} md={24} lg={9} xl={9} className="frieght-form">
          <div>
            <div className="qa-mar-top-12 qa-mar-btm-2">
              <Icon
                component={Air}
                style={{
                  width: "35px",
                  verticalAlign: "middle",
                  marginRight: "5px",
                }}
                className="air-icon"
              />
              <span className="p-shipBy">Air</span>
            </div>
            <div className="qa-pad-015 qa-dashed-border">
              <div className="c-left-blk">Estimated freight fees</div>
              <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                {airData ? (
                  <span>
                    {getSymbolFromCurrency(convertToCurrency)}
                    {airData["frightCostMin"]
                      ? getConvertedCurrency(
                          airData["frightCostMin"],
                          currencyDetails,
                          true
                        )
                      : "0"}
                    -{getSymbolFromCurrency(convertToCurrency)}
                    {airData["frightCostMax"]
                      ? getConvertedCurrency(
                          airData["frightCostMax"],
                          currencyDetails,
                          true
                        )
                      : "0"}
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="qa-pad-015 qa-dashed-border">
              <div className="c-left-blk">Estimated custom duties</div>
              <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                {airData ? (
                  <span>
                    {getSymbolFromCurrency(convertToCurrency)}
                    {airData["dutyMin"]
                      ? getConvertedCurrency(
                          airData["dutyMin"],
                          currencyDetails,
                          true
                        )
                      : "0"}
                    -{getSymbolFromCurrency(convertToCurrency)}
                    {airData["dutyMax"]
                      ? getConvertedCurrency(
                          airData["dutyMax"],
                          currencyDetails,
                          true
                        )
                      : "0"}
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="qa-pad-015 qa-dashed-border">
              <div className="c-left-blk">Total estimated charges</div>
              <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                {airData &&
                airData["frightCostMin"] !== undefined &&
                airData["dutyMin"] !== undefined ? (
                  <span>
                    {getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(
                      airData["frightCostMin"] + airData["dutyMin"],
                      currencyDetails,
                      true
                    )}
                    -{getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(
                      airData["frightCostMax"] + airData["dutyMax"],
                      currencyDetails,
                      true
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="qa-pad-015">
              <div className="c-left-blk">Shipping lead time</div>
              <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                {airData ? (
                  <span>
                    {airData["tat"] ? airData["tat"] - 3 : "0"}-
                    {airData["tat"] ? airData["tat"] : "0"} days
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={9} xl={9} className="frieght-sea-sec">
          <div>
            <div className="qa-mar-top-2 qa-mar-btm-2">
              <Icon
                component={Sea}
                style={{
                  width: "35px",
                  verticalAlign: "middle",
                  marginRight: "5px",
                }}
                className="sea-icon"
              />
              <span className="p-shipBy">Sea</span>
            </div>
            <div className="qa-pad-015 qa-dashed-border">
              <div className="c-left-blk">Estimated freight fees</div>
              <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                {seaData ? (
                  <span>
                    {getSymbolFromCurrency(convertToCurrency)}
                    {seaData["frightCostMin"]
                      ? getConvertedCurrency(
                          seaData["frightCostMin"],
                          currencyDetails,
                          true
                        )
                      : "0"}
                    -{getSymbolFromCurrency(convertToCurrency)}
                    {seaData["frightCostMax"]
                      ? getConvertedCurrency(
                          seaData["frightCostMax"],
                          currencyDetails,
                          true
                        )
                      : "0"}
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="qa-pad-015 qa-dashed-border">
              <div className="c-left-blk">Estimated custom duties</div>
              <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                {seaData ? (
                  <span>
                    {getSymbolFromCurrency(convertToCurrency)}
                    {seaData["dutyMin"]
                      ? getConvertedCurrency(
                          seaData["dutyMin"],
                          currencyDetails,
                          true
                        )
                      : "0"}
                    -{getSymbolFromCurrency(convertToCurrency)}
                    {seaData["dutyMax"]
                      ? getConvertedCurrency(
                          seaData["dutyMax"],
                          currencyDetails,
                          true
                        )
                      : "0"}
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="qa-pad-015 qa-dashed-border">
              <div className="c-left-blk">Total estimated charges</div>
              <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                {seaData &&
                seaData["frightCostMin"] !== undefined &&
                seaData["dutyMin"] !== undefined ? (
                  <span>
                    {getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(
                      seaData["frightCostMin"] + seaData["dutyMin"],
                      currencyDetails,
                      true
                    )}
                    -{getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(
                      seaData["frightCostMax"] + seaData["dutyMax"],
                      currencyDetails,
                      true
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="qa-pad-015">
              <div className="c-left-blk">Shipping lead time</div>
              <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                {seaData ? (
                  <span>
                    {seaData["tat"] ? seaData["tat"] - 7 : "0"}-
                    {seaData["tat"] ? seaData["tat"] : "0"} days
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </div>
        </Col>

        <Col span={24} className="cart-fr-detail">
          Estimated time to prepare and ship your order is{" "}
          {productType === "RTS"
            ? "7-10 days"
            : productType === "ERTM"
            ? "30-40 days"
            : "30-40 days"}
        </Col>
        <Col span={24} className="qa-pad-2 qa-mar-top-1">
          <div className="qa-tc-white qa-fs-20">Disclaimer</div>
          <div className="qa-tc-white qa-fs-14">
            *Freight and duties charges mentioned are estimates. You will be
            charged at actuals. <br></br>*Lead time mentioned is applicable once
            your order is shipped.
          </div>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currencyDetails: state.currencyConverter,
  };
};

export default connect(mapStateToProps, null)(FreightChargeCalculator);
