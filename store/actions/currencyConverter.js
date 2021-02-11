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
  let url = `https://api.exchangeratesapi.io/latest?base=${base}`;
  // let url = `${process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL}/currencies/conversion-rates?base=${base}`;

  fetch(url, {
    method: "GET",
    // headers: {
    //   "Content-Type": "application/json",
    //   Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
    // },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((res) => {
      console.log("API Resp 1 ", res);
      let currencies = res["rates"];
      let rates = Object.keys(res["rates"]).sort();
      if (callback) {
        callback(res);
      } else {
        return dispatch(setCurrency(rates, currencies));
      }
    })
    .catch((err) => {
      // console.log(err);
      // fetch(`https://api.exchangeratesapi.io/latest?base=${base}`, {
      //   method: "GET",
      // })
      //   .then((res) => {
      //     if (res.ok) {
      //       return res.json();
      //     } else {
      //       throw new Error("Something went wrong");
      //     }
      //   })
      //   .then((res) => {
      //     console.log("API Resp 2 ", res);
      //     let currencies = res["rates"];
      //     let rates = Object.keys(res["rates"]).sort();
      //     if (callback) {
      //       callback(res);
      //     } else {
      //       return dispatch(setCurrency(rates, currencies));
      //     }
      //   })
      //   .catch((err) => {
      //     // console.log(err.message);
      //   });
    });
};
