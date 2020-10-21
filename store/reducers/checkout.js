/** @format */

import * as actionTypes from "../types";

const initialState = {
  error: null,
  isLoading: false,
  cart: {},
  sfl: {},
};

const checkout = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CART:
      return {
        ...state,
        cart: action.payload.cart,
      };

    case actionTypes.SET_SFL:
      return {
        ...state,
        sfl: action.payload.sfl,
      };

    default:
      return state;
  }
};
export default checkout;
