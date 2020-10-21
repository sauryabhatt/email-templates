/** @format */

import { combineReducers } from "redux";
import auth from "./auth";
import appToken from "./appToken";
import userProfile from "./userProfile";
import sellerListing from "./sellerListing";
import currencyConverter from "./currencyConverter";
import checkout from "./checkout";


const createRootReducer = () =>
  combineReducers({
    appToken: appToken,
    auth: auth,
    userProfile: userProfile,
    sellerListing: sellerListing,
    currencyConverter: currencyConverter,
    checkout: checkout,
  });
export default createRootReducer;

