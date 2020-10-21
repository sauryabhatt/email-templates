/** @format */

import * as actionTypes from "./../types";

const initialState = {
  error: null,
  userProfile: null,
  isLoading: false,
  openRequest: [],
  meetingByStatus: [],
  meetingCount: 0,
  addresses: [],
  quotes: [],
  order: null,
  orders: [],
  brandNameList: [],
  isQuoteAvailable: false,
  isOrderAvailable: false
};

const userProfile = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_PROFILE_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case actionTypes.GET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload.userProfile,
      };

    case actionTypes.GET_USER_PROFILE_FAILED:
      return {
        ...state,
        error: action.payload.error,
      };
    case actionTypes.SET_OPEN_REQUEST:
      return {
        ...state,
        openRequest: action.payload.openRequest,
      };
    case actionTypes.SET_SCHEDULE_REQUESTS:
      return {
        ...state,
        meetingByStatus: action.payload.scheduleRequest,
      };
    case actionTypes.SET_MEETING_COUNT:
      return {
        ...state,
        meetingCount: action.payload.meetingCount,
      };

    case actionTypes.SET_MY_ADDRESSES:
      return {
        ...state,
        addresses: action.payload.addresses,
      };

    case actionTypes.SET_QUOTE_BY_STATUS:
      return {
        ...state,
        quotes: action.payload.quoteByStatus,
        isQuoteAvailable: true
      };

    case actionTypes.SET_ORDER_BY_ID:
      return {
        ...state,
        order: action.payload.order,
      };

    case actionTypes.GET_MY_ORDERS:
      return {
        ...state,
        orders: action.payload.orders,
        isOrderAvailable: true
      };

    case actionTypes.SET_BRAND_NAME:
      return {
        ...state,
        brandNameList: action.payload.brandNameList,
      };

    default:
      return state;
  }
};

export default userProfile;
