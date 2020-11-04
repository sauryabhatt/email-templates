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
      Authorization: token?`Bearer ${token}`:"Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MDQ0Mjc1MDMsImlhdCI6MTYwNDM5ODcwMywianRpIjoiOTUwMTNjNWItMGVkMS00Y2UxLWIxMzUtNDZjNjJmN2UyZjY3IiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiZTcxYjY5MDYtNTk1NS00ZjFiLThhMDctMGE4OWE5NzcwMjRhIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4xLjIwOCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LXJlYWN0dWkiLCJjbGllbnRBZGRyZXNzIjoiMTAuMi4xLjIwOCJ9.ZPl2AP5tiQcoc9SfGXZokJtjME1qXehu_-7lrpXetWryBKWnVbdsi5VlD1erfEDc399zbu8mgiGo-eR_xm2o_VIW2ilTP7dbGCKsBL3hrjzP1BrRncsoYQGl1SfaTRmK4Zln9ZyJhkmH5m1qy-6W_gPLxqIoFZfj7klub96j5gtVVVuO7ZDkXR-cByNgdjUuLktrbe-navNSDVWgNG374mnhb2D7_OSAurWXAlOAkhRGREzRDCVilpqRh7qFVlgqwGPoPAG7dl9NCiuDkf0EGYgU0q4I8DH65g_Jk4RCK9p0dXAfFZ0KVD7ujacsGGvSBybXqahFTbD-MoYhJkCiOQ",
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
