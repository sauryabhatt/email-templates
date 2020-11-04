/** @format */

import * as actionTypes from "./../types";

export const getCart = (token, callback = "") => async (dispatch) => {
  let url = `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/my/cart`;
  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "*/*",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Error while saving user deatils.";
      }
    })
    .then((res) => {
      let result = { ...res };
      result["currency"] = "USD";
      if (callback) {
        callback(res);
      }
      return dispatch(setCart(result));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setCart = (data) => {
  return {
    type: actionTypes.SET_CART,
    payload: {
      cart: data,
    },
  };
};

export const getSavedForLater = (token) => async (dispatch) => {
  let url = `${process.env.NEXT_PUBLIC_REACT_APP_WISHLIST_URL}/v1/my/wish-list`;
  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "*/*",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Error while saving user deatils.";
      }
    })
    .then((res) => {
      return dispatch(setSFL(res));
    })
    .catch((err) => {
      // console.log(err.message);
      // message.error((err.message || err), 5);
      // setErrors(errors.concat(err));
    });
};

export const setSFL = (data) => {
  return {
    type: actionTypes.SET_SFL,
    payload: {
      sfl: data,
    },
  };
};

export const checkCart = (token, callback = "") => async (dispatch) => {
  let url = process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL + "/v1/orders/my";
  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "*/*",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Error while saving user deatils.";
      }
    })
    .then((res) => {
      if (callback) {
        callback(res);
      }
      return dispatch(setCart(res));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const checkInventory = (token, skuId = "", callback = "") => async (
  dispatch
) => {
  let url = `${process.env.NEXT_PUBLIC_REACT_APP_INVENTORY_URL}/inventory`;
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(skuId),
    headers: {
      "Content-Type": "application/json",
      Authorization: token?`Bearer ${token}`:"Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MTIyNTU0MjgsImlhdCI6MTYwNDQ3OTQyOCwianRpIjoiZWUxMjk1YTMtNTlmMi00MzRlLTk3NjMtZTY5MzBiZThkZDAwIiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiYTIwMTg5YTYtNjgzZC00YjI3LWI3ZDktMmFmNTA3MzY4Y2QzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4wLjQyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtcmVhY3R1aSIsImNsaWVudEFkZHJlc3MiOiIxMC4yLjAuNDIifQ.V6-7rnSb6RxhxwsDolIMx6MtdUUSoZjOsFIAF5S9f8OCCm_MCeane_xQYqR_49jZ8S2eiTk829n6UtVmr-ogtrtb0-L9akHw_8JyNDErd2yir0vQODjgJgVrMvgHrbywzD536n4Xv610pQWmnCfCUGgezTthwf5-I0sek0ZvSAYg0EnUcs4TcrSfG7Raqx_-32ngWORriOub6OXdA7gNwINJ0_WBtghz5OfG1gEP9kBZGJK5Ze-02qv_I2ioQo0E7dt7sMYS7cjbhzxCuHllaM1-3MNdkJ1GfW9g66LIcal7JdR0RVzQvqXjoUlz_SohSegGAC19gwojD8G9nc3FTw",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Error while signing up.";
      }
    })
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateCart = (
  token,
  action = "",
  obj = "",
  callback = ""
) => async (dispatch) => {
  let url =
    process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL +
    `/v1/orders/my/cart?cart_action=${action}`;
  return await fetch(url, {
    method: "PUT",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        callback();
      } else {
        throw res.statusText || "Error while sending e-mail.";
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getOrder = (orderId, token) => async (dispatch) => {
  let url = `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/composite/${orderId}`;
  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "*/*",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Error while saving user deatils.";
      }
    })
    .then((res) => {
      let result = { ...res };
      result["currency"] = "USD";
      return dispatch(setCart(result));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const checkCartAPI = (token, callback = "") => async (dispatch) => {
  let url = process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL + "/v1/orders/my";
  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "*/*",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Error while saving user deatils.";
      }
    })
    .then((res) => {
      if (callback) {
        callback(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
