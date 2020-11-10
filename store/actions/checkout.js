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
      Authorization: token?`Bearer ${token}`:"Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
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
