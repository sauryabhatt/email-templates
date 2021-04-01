/** @format */

import * as actionTypes from "../types";

const ACCESS_KEY_CURRENCY = "87ae633e1a755dc2a6daca48416a3a46";

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
  let url = `https://api.exchangeratesapi.io/v1/latest?access_key=${ACCESS_KEY_CURRENCY}`;
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
      let fallbackData = {
        USD: 1,
      };
      let currencies;
      if (res["success"] === true) {
        currencies = res["rates"];
      } else {
        currencies = fallbackData;
      }

      let rates = Object.keys(currencies).sort();
      if (callback) {
        callback(res);
      } else {
        return dispatch(setCurrency(rates, currencies));
      }
    })
    .catch((err) => {
      let fallbackData = {
        USD: 1,
      };
      let currencies = fallbackData;

      let rates = Object.keys(fallbackData).sort();
      if (callback) {
        callback(res);
      } else {
        return dispatch(setCurrency(rates, currencies));
      }
      // console.log(err.message);
    });
};
