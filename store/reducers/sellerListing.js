/** @format */

import * as actionTypes from "./../types";

const initialState = {
  error: null,
  content: null,
  count: 0,
  isLoading: false,
  slp_count: 0,
  slp_content: null,
  slp_facets: null,
  slp_categories: null,
  productDetails: null,
  sellerDetails: null,
};

const sellerListing = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_LISTING_PAGE_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case actionTypes.GET_LISTING_PAGE:
      return {
        ...state,
        count: action.payload.count,
        content: action.payload.content,
      };

    case actionTypes.GET_SELLER_DETAILS:
      return {
        ...state,
        sellerDetails: action.payload.sellerDetails,
      };

    case actionTypes.GET_SLP_DETAILS:
      return {
        ...state,
        slp_count: action.payload.slp_count,
        slp_content: action.payload.slp_content,
        slp_facets: action.payload.slp_facets,
        slp_categories: action.payload.slp_categories,
      };

    case actionTypes.GET_LISTING_PAGE_FAILED:
      return {
        ...state,
        error: action.payload.error,
      };

    case actionTypes.GET_PRODUCT_DETAILS:
      return {
        ...state,
        productDetails: action.payload.productDetails,
      };

    default:
      return state;
  }
};
export default sellerListing;
