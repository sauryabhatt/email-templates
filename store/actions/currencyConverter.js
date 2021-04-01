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
  let url = `https://api.fastforex.io/fetch-all?from=${base}&api_key=2ff4f48393-c9b2427d6e-qqvmak`;
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
      let currencies = res["results"] || fallbackData;

      let rates = Object.keys(res["results"] || fallbackData).sort();
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
