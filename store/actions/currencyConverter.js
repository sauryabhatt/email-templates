/** @format */

import * as actionTypes from "../types";

export const setCurrency = (currencies, rates) => {
  return {
    type: actionTypes.GET_CURRENCY_CONVERSION,
    payload: { currencies, rates },
  };
};

export const setCurrencyFormat = (convertToCurrency) => {
  return {
    type: actionTypes.GET_CURRENCY_CONVERSION_FORMAT,
    payload: { convertToCurrency },
  };
};

export const getCurrentFormat = (convertToCurrency) => {
  return (dispatch) => {
    dispatch(setCurrencyFormat(convertToCurrency));
  };
};

export const getCurrencyConversion = (base, callback = "") => async (
  dispatch
) => {
  let url = `${process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL}/currencies/conversion-rates?base=${base}`;

  let hours = 2;
  let saved = sessionStorage.getItem("currencySaved");
  let currencyDetails = sessionStorage.getItem("currencyDetails");
  let retryCount = 0;
  console.log(saved, currencyDetails);

  const getCurrencyDetails = () => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((res) => {
        sessionStorage.setItem("currencySaved", new Date().getTime());
        let currencies = res["rates"] || { USD: 1.0 };
        let rates = Object.keys(currencies).sort();
        let obj = {};
        obj["rates"] = currencies;
        if (callback) {
          callback(obj);
        }
        sessionStorage.setItem("currencyDetails", JSON.stringify(obj));
        return dispatch(setCurrency(rates, currencies));
      })
      .catch((err) => {
        console.log("Error api call", err);

        if (retryCount < 3) {
          getCurrencyDetails();
        } else {
          let obj = sessionStorage.getItem("currencyDetails") || {};
          obj = JSON.parse(obj);
          let currencies = obj["rates"] || { USD: 1.0 };
          let rates = Object.keys(currencies).sort();
          return dispatch(setCurrency(rates, currencies));
        }
        retryCount++;
      });
  };

  if (
    saved &&
    currencyDetails &&
    new Date().getTime() - saved > hours * 60 * 60 * 1000
  ) {
    console.log("More than 2 hours");
    getCurrencyDetails();
  } else {
    if (
      sessionStorage.getItem("currencyDetails") &&
      sessionStorage.getItem("currencySaved")
    ) {
      console.log("From storage");
      let obj = sessionStorage.getItem("currencyDetails") || {};
      obj = JSON.parse(obj);
      if (callback) {
        callback(obj);
      }
      let currencies = obj["rates"] || { USD: 1.0 };
      let rates = Object.keys(currencies).sort();
      return dispatch(setCurrency(rates, currencies));
    } else {
      console.log("New api call");
      getCurrencyDetails();
    }
  }
};
