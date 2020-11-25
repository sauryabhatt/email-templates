/** @format */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
// import scriptLoader from "react-async-script-loader";
import { message } from "antd";
// import Car from "../assets/img/car.jpg";
// import Spinner from "./Spinner";
import states from "../../public/filestore/stateCodes_en.json";
import countries from "../../public/filestore/countryCodes_en.json";
// import { PayPalButton } from "react-paypal-button-v2";
const PaypalButton = (props) => {
  const [sdkReady, setSdkReady] = useState(false);

  const updatePaypalSdk = () => {
    let url = null;
    if (props.locale) {
      url = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_REACT_APP_PAYPAL_CLIENT_ID}&currency=${props.currency}&intent=order&locale=${props.locale}&disable-funding=credit,bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort`;
    } else {
      url = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_REACT_APP_PAYPAL_CLIENT_ID}&currency=${props.currency}&intent=order&disable-funding=credit,bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort`;
    }
    const script = document.getElementById("paypal-script");
    script.src = url;
    script.onload = () => {
      setSdkReady(true);
    };
    script.onerror = () => {
      throw new Error("Paypal SDK could not be loaded.");
    };
    document.body.appendChild(script);
  };
  useEffect(() => {
    if (window !== undefined) {
      updatePaypalSdk();
    } else if (
      window !== undefined &&
      window.paypal !== undefined &&
      props.onButtonReady
    ) {
      props.onButtonReady();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const getConvertedCurrency = (baseAmount, conversionFactor) => {
    // let { convertToCurrency = "", rates = [] } = props.currencyDetails;
    return Number.parseFloat(parseFloat(baseAmount) * conversionFactor).toFixed(
      2
    );
  };

  const prepareItems = (orders, conversionFactor) => {
    let arr = [];
    orders.map((order) => {
      order.products.map((product) => {
        let obj = {
          name: product.productName,
          description: product.productName,
          unit_amount: {
            currency_code: props.currency,
            value: props.isCartSummary
              ? getConvertedCurrency(product.exFactoryPrice, conversionFactor)
              : product.unitPrice.toFixed(2).toString(),
          },
          quantity: product.quantity.toString(),
          category: "PHYSICAL_GOODS",
        };
        arr.push(obj);
      });
    });
    return arr;
  };

  const getSumOfProd = (orders, isCartSummary, conversionFactor) => {
    let sum = 0;
    orders.map((order) => {
      order.products.map((product) => {
        if (isCartSummary) {
          let basePrice = product.exFactoryPrice * product.quantity;
          sum =
            sum + parseFloat(getConvertedCurrency(basePrice, conversionFactor));
        } else {
          sum = sum + product.totalProductCost;
        }
      });
    });
    return sum.toFixed(2);
  };

  const getHandlingAmount = (orders, conversionFactor) => {
    let sum = 0;
    if (!props.isCartSummary) {
      sum =
        sum +
        props.order.miscCharges.find((x) => x.chargeId === "QALARA_CHARGES")
          .amount;
      sum =
        sum +
        ((props.order.miscCharges.find((x) => x.chargeId === "VAT") &&
          props.order.miscCharges.find((x) => x.chargeId === "VAT").amount) ||
          0);
    } else {
      sum =
        sum +
        parseFloat(
          parseFloat(
            getConvertedCurrency(
              Number.parseFloat(
                props.order.miscCharges.find((x) => x.chargeId === "VAT").amount
              ),
              conversionFactor
            )
          ).toFixed(2)
        );
    }
    orders.map((order) => {
      let { qalaraSellerMargin = 0 } = order;
      if (props.isCartSummary) {
        sum = sum + parseFloat(0);
        // sum = sum + parseFloat(parseFloat(getConvertedCurrency(Number.parseFloat(qalaraSellerMargin), conversionFactor)).toFixed(2));
      }
      order.products.map((product) => {
        if (product.sampleCost) {
          sum =
            sum +
            parseFloat(
              parseFloat(
                getConvertedCurrency(
                  Number.parseFloat(product.sampleCost),
                  conversionFactor
                )
              ).toFixed(2)
            );
        }

        if (product.qualityTestingCharge) {
          sum =
            sum +
            parseFloat(
              parseFloat(
                getConvertedCurrency(
                  Number.parseFloat(product.qualityTestingCharge),
                  conversionFactor
                )
              ).toFixed(2)
            );
        }
      });
    });
    return sum.toFixed(2);
  };

  const getStateCode = () => {
    let countryObj = states.find((state) => {
      return state.country == props.order.shippingAddressDetails["country"];
    });

    let state =
      countryObj &&
      countryObj.stateCodes.find((state) => {
        return state.state == props.order.shippingAddressDetails["state"];
      });

    return (state && state.stateCode) || null;
  };

  const getCountryCode = () => {
    let code =
      countries[props.order.shippingAddressDetails["country"].toUpperCase()];
    return code || props.order.shippingAddressDetails["country"];
  };

  const createOrder = (data, actions) => {
    let conversionFactor =
      props.currencyDetails == null ||
      props.currencyDetails.convertToCurrency == "USD"
        ? 1
        : Number.parseFloat(
            Math.round(
              (props.currencyDetails.rates[
                props.currencyDetails.convertToCurrency
              ] +
                Number.EPSILON) *
                100
            ) / 100
          ).toFixed(2);

    let itemsList = prepareItems(props.order.subOrders, conversionFactor);
    let sumOfProd = getSumOfProd(
      props.order.subOrders,
      props.isCartSummary,
      conversionFactor
    );
    let handlingSum = getHandlingAmount(
      props.order.subOrders,
      conversionFactor
    );
    let stateCode = getStateCode();
    let countryCode = getCountryCode();
    let paymentObj = null;
    let totalAmount =
      parseFloat(parseFloat(sumOfProd).toFixed(2)) +
      parseFloat(
        parseFloat(
          getConvertedCurrency(
            props.order.miscCharges
              .find((x) => x.chargeId === "TOTAL_COST_FREIGHT_MAX")
              .amount.toString(),
            conversionFactor
          )
        ).toFixed(2)
      ) +
      parseFloat(parseFloat(handlingSum).toFixed(2)) +
      parseFloat(
        parseFloat(
          getConvertedCurrency(
            props.order.miscCharges
              .find((x) => x.chargeId === "DUTY_MAX")
              .amount.toString(),
            conversionFactor
          )
        ).toFixed(2)
      ) -
      parseFloat(parseFloat(props.order.promoDiscount || 0).toFixed(2));
    totalAmount = parseFloat(
      Math.round((totalAmount + Number.EPSILON) * 100) / 100
    ).toFixed(2);
    console.log("totalAmount: ", totalAmount);

    // if (
    //   props.currencyDetails !== null &&
    //   props.currencyDetails.convertToCurrency !== "USD"
    // ) {
    //   handlingSum =
    //     parseFloat(handlingSum) +
    //     parseFloat(
    //       parseFloat((props.order.total * conversionFactor).toFixed(2)) -
    //         (parseFloat(handlingSum) +
    //           parseFloat(
    //             parseFloat(
    //               getConvertedCurrency(
    //                 props.order.miscCharges
    //                   .find((x) => x.chargeId === "FREIGHT_MAX")
    //                   .amount.toString(),
    //                 conversionFactor
    //               )
    //             ).toFixed(2)
    //           ) +
    //           parseFloat(sumOfProd) +
    //           parseFloat(
    //             parseFloat(
    //               getConvertedCurrency(
    //                 props.order.miscCharges
    //                   .find((x) => x.chargeId === "DUTY_MAX")
    //                   .amount.toString(),
    //                 conversionFactor
    //               )
    //             ).toFixed(2)
    //           ))
    //     );
    // }
    paymentObj = {
      gbPayment: {
        gbOrderNo: props.order.orderId,
        tenderedAmt: props.isCartSummary
          ? (props.order.total * conversionFactor).toFixed(2)
          : props.order.miscCharges
              .find((x) => x.chargeId === "TOTAL_AMOUNT")
              .amount.toFixed(2),
        currency: props.currency,
        conversionFactor: conversionFactor,
        invoice_id: props.order.orderId + "_" + Date.now().toString(),
      },
      ppCreateOrderRequest: {
        intent: "AUTHORIZE",
        processing_instruction: "ORDER_SAVED_EXPLICITLY",
        application_context: {
          brand_name: "Qalara",
          user_action: "PAY_NOW",
          shipping_preference: "SET_PROVIDED_ADDRESS",
          return_url: "https://www.example.com/return",
          cancel_url: "https://www.example.com/cancel",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
        },
        payer: {
          name: {
            given_name: props.user.firstName,
            surname: props.user.lastName || props.user.firstName,
          },
          email_address: props.user.email,
          phone: {
            phone_type: "MOBILE",
            phone_number: {
              national_number: props.user.orgPhone || props.user.personalPhone,
            },
          },
          address: {
            address_line_1: props.order.billingAddressDetails["addressLine1"],
            address_line_2: props.order.billingAddressDetails["addressLine2"],
            admin_area_2: props.order.billingAddressDetails["city"].trim(),
            admin_area_1:
              stateCode || props.order.billingAddressDetails["state"],
            postal_code: props.order.billingAddressDetails["zipCode"].trim(),
            country_code: countryCode,
          },
        },
        purchase_units: [
          {
            description: props.order.orderId,
            invoice_id:
              props.order.orderId.toString() + "_" + Date.now().toString(),
            custom_id: props.order.orderId,
            soft_descriptor: "Qalara",
            amount: {
              currency_code: props.currency,
              value: props.isCartSummary
                ? (props.order.total * conversionFactor).toFixed(2)
                : props.order.miscCharges
                    .find((x) => x.chargeId === "TOTAL_AMOUNT")
                    .amount.toFixed(2)
                    .toString(),
              breakdown: {
                item_total: {
                  currency_code: props.currency,
                  value: sumOfProd.toString(),
                },
                shipping: {
                  currency_code: props.currency,
                  value: props.isCartSummary
                    ? parseFloat(
                        parseFloat(
                          getConvertedCurrency(
                            props.order.miscCharges
                              .find(
                                (x) => x.chargeId === "TOTAL_COST_FREIGHT_MAX"
                              )
                              .amount.toString(),
                            conversionFactor
                          )
                        ).toFixed(2)
                      )
                        .toFixed(2)
                        .toString()
                    : props.order.miscCharges
                        .find((x) => x.chargeId === "TOTAL_COST_FREIGHT_MAX")
                        .amount.toFixed(2)
                        .toString(),
                },
                handling: {
                  currency_code: props.currency,
                  value: parseFloat(handlingSum).toFixed(2),
                },
                tax_total: {
                  currency_code: props.currency,
                  value: props.isCartSummary
                    ? parseFloat(
                        parseFloat(
                          getConvertedCurrency(
                            props.order.miscCharges
                              .find((x) => x.chargeId === "DUTY_MAX")
                              .amount.toString(),
                            conversionFactor
                          )
                        ).toFixed(2)
                      )
                        .toFixed(2)
                        .toString()
                    : props.order.miscCharges
                        .find((x) => x.chargeId === "CUSTOM_CHARGES")
                        .amount.toFixed(2)
                        .toString(),
                },
                discount: {
                  currency_code: props.currency,
                  value:
                    props.order.promoDiscount && props.order.promoDiscount > 0
                      ? parseFloat(
                          getConvertedCurrency(
                            props.order.promoDiscount,
                            conversionFactor
                          )
                        ).toFixed(2)
                      : 0,
                },
              },
            },
            shipping: {
              name: {
                full_name: `${props.user.firstName} ${props.user.lastName}`,
              },
              address: {
                address_line_1:
                  props.order.billingAddressDetails["addressLine1"],
                address_line_2:
                  props.order.billingAddressDetails["addressLine2"],
                admin_area_2: props.order.billingAddressDetails["city"],
                admin_area_1:
                  stateCode || props.order.billingAddressDetails["state"],
                postal_code: props.order.billingAddressDetails["zipCode"],
                country_code: countryCode,
              },
            },
            items: itemsList,
          },
        ],
      },
    };

    return fetch(
      process.env.NEXT_PUBLIC_REACT_APP_PAYMENTS_URL +
        "/payments/paypal/checkout/orders",
      {
        method: "POST",
        body: JSON.stringify(paymentObj),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        // message.success('Your info has been updated successfully.', 5);
        // setSuccessUpdateVisible(true);
        return res.id;
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        // setLoading(false);
      });
  };

  const onApprove = (data, actions) => {
    return props.saveOrder(data.orderID, actions);
  };

  if (!sdkReady && window.paypal === undefined) {
    return <div>Loading...</div>;
  }

  const Button = window.paypal.Buttons.driver("react", {
    React,
    ReactDOM,
  });

  const handleError = (actions) => {
    if (!document.querySelector("#check").checked) {
      props.showError(true);
    } else {
      props.showError(false);
    }
  };

  const isTermsAccepted = () => {
    return document.querySelector("#check").checked;
  };

  const toggleButton = (actions) => {
    return isTermsAccepted() ? actions.enable() : actions.disable();
  };

  const onChangeCheckbox = (handler) => {
    document.querySelector("#check").addEventListener("change", handler);
  };
  //you can set your style to whatever read the documentation for different styles I have put some examples in the style tag
  return (
    <Button
      {...props}
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
      style={{
        color: "gold",
        layout: "vertical",
        label: "pay",
        // tagline: 'false'
      }}
      onInit={(data, actions) => {
        toggleButton(actions);
        onChangeCheckbox(function () {
          toggleButton(actions);
        });
      }}
      onClick={(data, actions) => handleError(actions)}
    />
  );
};

export default PaypalButton;
