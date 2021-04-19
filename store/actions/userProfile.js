/** @format */

import * as actionTypes from "./../types";
import Router from "next/router";
import queryString from "query-string";
import { message } from "antd";

export const setUserProfileLoading = (isLoading) => {
  return {
    type: actionTypes.GET_USER_PROFILE_LOADING,
    payload: {
      isLoading: isLoading,
    },
  };
};

export const setUserProfile = (userProfile) => {
  return {
    type: actionTypes.GET_USER_PROFILE,
    payload: {
      userProfile: userProfile,
    },
  };
};

export const setUserProfileFailed = (error) => {
  return {
    type: actionTypes.GET_USER_PROFILE_FAILED,
    payload: {
      error: error,
    },
  };
};

const setUserProfileData = (data, token) => {
  fetch(
    process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/profiles/update/my",
    {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Error while sending request.";
      }
    })
    .then((res) => {
      let { profileCreated = "" } = res;
      if (profileCreated === true) {
        getUserProfile(token);
      }
    })
    .catch((err) => {
      console.log(err);
      getUserProfile(token);
    });
};

export const getUserProfile = (token) => {
  return (dispatch) => {
    dispatch(setUserProfileLoading(true));
    return fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/profiles/my",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while fetching user profile.";
        }
      })
      .then((result) => {
        // dispatch(getMeetingCount(result.profileId, token));
        let { profileCreated = false } = result || {};
        if (profileCreated === null || profileCreated === false) {
          let data = {};
          fetch("https://ipapi.co/json/", {
            method: "GET",
          })
            .then((response) => response.json())
            .then((result) => {
              let { ip = "", country_name = "" } = result;
              data.ipAddress = ip;
              data.country = country_name;
              setUserProfileData(data, token);
            })
            .catch((err) => {
              console.log(err);
              let { ip = "", country_name = "" } = {};
              data.ipAddress = ip;
              data.country = country_name;
              setUserProfileData(data, token);
            });
        } else {
          dispatch(setUserProfileLoading(false));
          return dispatch(setUserProfile(result));
        }
      })
      .catch((error) => {
        console.log("Inside profile error");
        console.log(error.message);
        console.log(error);

        // const values = queryString.parse(Router.asPath);
        // if (values.redirectURI) {
        //   Router.push(
        //     "/error?message=" +
        //       (error.message || error) +
        //       "&redirectURI=" +
        //       values.redirectURI
        //   );
        // } else {
        //   Router.push(
        //     "/error?message=" +
        //       (error.message || error) +
        //       "&redirectURI=" +
        //       Router.query.pathname
        //   );
        // }
        dispatch(setUserProfileLoading(false));
        return dispatch(setUserProfileFailed(error));
      });
  };
};

export const setSellerAgreement = (filename, token) => async (dispatch) => {
  let ip_details = await dispatch(getCurrentIP());
  // console.log(ip_details.ip);
  let body = {
    agreementAgreed: true,
    agreementSourceIP: (ip_details && ip_details.ip) || null,
    agreementTitle: filename,
  };

  fetch(process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/profiles/my", {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
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
      return true;
    })
    .catch((err) => {
      // console.log(err.message);
      // message.error((err.message || err), 5);
      // setErrors(errors.concat(err));
    });
};

export const getCurrentIP = () => async (dispatch) => {
  return await fetch("https://ipapi.co/json/", {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((err) => {
      // console.log("Error ", err);
    });
};

export const getOpenRequest = (token, profileId, status) => async (
  dispatch
) => {
  // dispatch(setScheduleRequests(scheduleRequests))
  let url =
    process.env.NEXT_PUBLIC_REACT_APP_API_MEETING_URL +
    "/events/meeting/my?profile_id=" +
    profileId +
    "&status=" +
    status;
  fetch(url, {
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
      return dispatch(setOpenRequest(res));
    })
    .catch((err) => {
      // console.log(err.message);
      // message.error((err.message || err), 5);
      // setErrors(errors.concat(err));
    });
};

export const setOpenRequest = (result) => {
  return {
    type: actionTypes.SET_OPEN_REQUEST,
    payload: {
      openRequest: result,
    },
  };
};

export const setScheduleRequests = (result) => {
  return {
    type: actionTypes.SET_SCHEDULE_REQUESTS,
    payload: {
      scheduleRequest: result,
    },
  };
};

export const getRequestByStatus = (token, profileId, status) => {
  return (dispatch) => {
    let url =
      process.env.NEXT_PUBLIC_REACT_APP_API_MEETING_URL +
      "/events/meeting/my?profile_id=" +
      profileId +
      "&status=" +
      status;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
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
        return dispatch(setScheduleRequests(res));
      })
      .catch((err) => {
        // console.log(err.message);
        // message.error((err.message || err), 5);
        // setErrors(errors.concat(err));
      });
  };
};

export const getMeetingCount = (profileId, token) => {
  return (dispatch) => {
    let url =
      process.env.NEXT_PUBLIC_REACT_APP_API_MEETING_URL +
      "/events/meeting/count?profile_id=" +
      profileId;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
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
        return dispatch(setMeetingCount(res));
        // return dispatch(setScheduleRequests(res));
      })
      .catch((err) => {
        // console.log(err.message);
        // message.error((err.message || err), 5);
        // setErrors(errors.concat(err));
      });
  };
};

export const setMeetingCount = (count) => {
  return {
    type: actionTypes.SET_MEETING_COUNT,
    payload: {
      meetingCount: count,
    },
  };
};

export const getAddresses = (token) => async (dispatch) => {
  // dispatch(setScheduleRequests(scheduleRequests))
  let url = process.env.NEXT_PUBLIC_REACT_APP_CONTACTS_URL + "/contacts/my";
  fetch(url, {
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
      return dispatch(setMyAddresse(res));
    })
    .catch((err) => {
      // console.log(err.message);
      // message.error((err.message || err), 5);
      // setErrors(errors.concat(err));
    });
};

export const setMyAddresse = (data) => {
  return {
    type: actionTypes.SET_MY_ADDRESSES,
    payload: {
      addresses: data,
    },
  };
};

export const getBrandNameByCode = (codes, token, quoteData) => async (
  dispatch
) => {
  fetch(
    process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
      "/seller-home/internal-views/multi?ids=" +
      codes,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Oops something went wrong. Please try again!";
      }
    })
    .then((res) => {
      return dispatch(setBrandNameByIds(res));
      // getBrandNameByIds()
    })
    .catch((err) => {
      // message.error(err.message || err, 5);
    });
};

export const getQuoteByStatus = (token, status, currentTab, buyerId) => async (
  dispatch
) => {
  // dispatch(setScheduleRequests(scheduleRequests))
  fetch(
    process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL +
      "/quotes/custom?status=" +
      status +
      "&buyer_id=" +
      buyerId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Oops something went wrong. Please try again!";
      }
    })
    .then((res) => {
      let sellerCodeList = [];
      if (currentTab != "requested") {
        res.map((e) => {
          if (e.subOrders) {
            e.subOrders.map((sub) => {
              if (!sellerCodeList.includes(sub.sellerCode)) {
                sellerCodeList.push(sub.sellerCode);
              }
            });
          } else {
            if (!sellerCodeList.includes(e.sellerCode)) {
              sellerCodeList.push(e.sellerCode);
            }
          }
        });
        let codes = sellerCodeList.join();
        dispatch(getBrandNameByCode(codes, token, res));
      } else {
        res.map((e) => {
          if (!sellerCodeList.includes(e.sellerCode)) {
            sellerCodeList.push(e.sellerCode);
          }
        });
        let codes = sellerCodeList.join();
        dispatch(getBrandNameByCode(codes, token, res));
      }
      return dispatch(setQuoteBYStatus(res));
    })
    .catch((err) => {
      // message.error(err.message || err, 5);
    });
};

export const setBrandNameByIds = (data) => {
  return {
    type: actionTypes.SET_BRAND_NAME,
    payload: {
      brandNameList: data,
    },
  };
};

export const setQuoteBYStatus = (data) => {
  return {
    type: actionTypes.SET_QUOTE_BY_STATUS,
    payload: {
      quoteByStatus: data,
    },
  };
};

export const getOrderByOrderId = (token, orderId) => async (dispatch) => {
  // dispatch(setScheduleRequests(scheduleRequests))
  fetch(
    process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL +
      "/orders/composite/" +
      orderId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Oops something went wrong. Please try again!";
      }
    })
    .then((res) => {
      let sellerCodeList = [];
      res.subOrders.map((subOrder) => {
        if (!sellerCodeList.includes(subOrder.sellerCode)) {
          sellerCodeList.push(subOrder.sellerCode);
        }
      });
      let codes = sellerCodeList.join();
      dispatch(getBrandNameByCode(codes, token, res));
      return dispatch(setOrderByOrderId(res));
    })
    .catch((err) => {
      // message.error(err.message || err, 5);
    });
};

export const setOrderByOrderId = (data) => {
  return {
    type: actionTypes.SET_ORDER_BY_ID,
    payload: {
      order: data,
    },
  };
};

export const getOrders = (token) => async (dispatch) => {
  // dispatch(setScheduleRequests(scheduleRequests))
  let url = process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL + "/orders";
  fetch(url, {
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
      let sellerCodeList = [];
      let typeOrder = { open: [], delivered: [], cancelled: [] };
      res.map((e) => {
        let subTotal = 0;
        if (e.subOrders) {
          e.subOrders.map((sub) => {
            subTotal += sub.total;
            if (!sellerCodeList.includes(sub.sellerCode)) {
              sellerCodeList.push(sub.sellerCode);
            }
          });
        }
        e.subTotal = subTotal;
        if (e.status === "DELIVERED") {
          typeOrder.delivered.push(e);
        } else if (e.status === "CANCELED") {
          typeOrder.cancelled.push(e);
        } else {
          typeOrder.open.push(e);
        }
      });
      let codes = sellerCodeList.join();
      dispatch(getBrandNameByCode(codes, token, res));
      return dispatch(setMyOrders(res, typeOrder));
    })
    .catch((err) => {
      // console.log(err.message);
      // message.error((err.message || err), 5);
      // setErrors(errors.concat(err));
    });
};

export const setMyOrders = (data, typeOrder) => {
  return {
    type: actionTypes.GET_MY_ORDERS,
    payload: {
      orders: data,
      typeOrder: typeOrder,
    },
  };
};

export const getRfqByStatus = (status, token, buyerId) => async (dispatch) => {
  // dispatch(setScheduleRequests(scheduleRequests))
  fetch(
    process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL +
      "/forms/queries/status?buyer_id=" +
      buyerId +
      "&status=OPEN",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res.statusText || "Oops something went wrong. Please try again!";
      }
    })
    .then((res) => {
      let sellerCodeList = [];
      res.map((e) => {
        if (!sellerCodeList.includes(e.sellerId)) {
          sellerCodeList.push(e.sellerId);
        }
      });
      let codes = sellerCodeList.join();
      dispatch(getBrandNameByCode(codes, token, res));
      return dispatch(setQuoteBYStatus(res));
    })
    .catch((err) => {
      // message.error(err.message || err, 5);
    });
};

// Get Collections
export const getCollections = (token, buyerId, callback = "") => async (
  dispatch
) => {
  let url =
    process.env.NEXT_PUBLIC_REACT_APP_COLLECTION_URL +
    "/collections/buyer?buyer_id=" +
    buyerId;
  fetch(url, {
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
      return dispatch(setMyCollections(res));
    })
    .catch((err) => {
      // console.log(err.message);
      // message.error((err.message || err), 5);
      // setErrors(errors.concat(err));
    });
};

export const setMyCollections = (data) => {
  return {
    type: actionTypes.SET_MY_COLLECTION,
    payload: {
      collections: data,
    },
  };
};
