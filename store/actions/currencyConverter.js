/** @format */

import * as actionTypes from "../types";

export const setCurrency = (currencies, rates) => {
  return {
    type: actionTypes.GET_CURRENCY_CONVERSION,
    payload: { currencies, rates },
  };
};

export const setCurrencyFormat = (convertToCurrency) => {
  console.log(convertToCurrency);
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
  let url = `https://api.exchangeratesapi.io/latest?base=${base}`;
  fetch(url, {
    method: "GET",
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Error while saving user deatils.";
      }
    })
    .then((res) => {
      let currencies = res["rates"];
      let rates = Object.keys(res["rates"]).sort();
      if (callback) {
        callback(res);
      } else {
        return dispatch(setCurrency(rates, currencies));
      }
    })
    .catch((err) => {
      // console.log(err.message);
    });
};
