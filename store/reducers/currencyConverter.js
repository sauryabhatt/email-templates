/** @format */

import * as actionTypes from "../types";

const initialState = {
  currencies: [],
  rates: [],
  convertToCurrency: "USD",
};

const currencyConverter = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_CURRENCY_CONVERSION:
      return {
        ...state,
        currencies: action.payload.currencies,
        rates: action.payload.rates,
      };

    case actionTypes.GET_CURRENCY_CONVERSION_FORMAT:
      return {
        ...state,
        convertToCurrency: action.payload.convertToCurrency,
      };

    default:
      return state;
  }
};
export default currencyConverter;
