/** @format */

import * as actionTypes from "./../types";

export const setListingPageLoading = (isLoading) => {
  return {
    type: actionTypes.GET_LISTING_PAGE_LOADING,
    payload: {
      isLoading: isLoading,
    },
  };
};

export const setListingPage = (count, content) => {
  return {
    type: actionTypes.GET_LISTING_PAGE,
    payload: {
      count: count,
      content: content,
    },
  };
};

export const setSellerDetails = (sellerDetails) => {
  return {
    type: actionTypes.GET_SELLER_DETAILS,
    payload: {
      sellerDetails: sellerDetails,
    },
  };
};

export const setProductDetails = (productDetails) => {
  return {
    type: actionTypes.GET_PRODUCT_DETAILS,
    payload: {
      productDetails: productDetails,
    },
  };
};

export const setSLPDetails = (
  totalHits,
  sellerHomeLiteViews,
  aggregates,
  categories
) => {
  return {
    type: actionTypes.GET_SLP_DETAILS,
    payload: {
      slp_count: totalHits,
      slp_content: sellerHomeLiteViews,
      slp_facets: aggregates,
      slp_categories: categories,
    },
  };
};

export const setListingPageFailed = (error) => {
  return {
    type: actionTypes.GET_LISTING_PAGE_FAILED,
    payload: {
      error: error,
    },
  };
};

export const getSLPDetails = (
  queryResult,
  loader = false,
  prevStateData = false
) => {
  return (dispatch) => {
    if (loader) dispatch(setListingPageLoading(true));
    return fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
        "/seller-homev2?" +
        queryResult,
      {
        method: "GET",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw (
            res.statusText || "Error while fetching seller listing details."
          );
        }
      })
      .then((result) => {
        let {
          totalHits = 0,
          sellerHomeLiteViews = [],
          aggregates = [],
          fixedAggregates = {},
        } = result;
        dispatch(setListingPageLoading(false));
        if (prevStateData) {
          let newStateData = [...prevStateData, ...sellerHomeLiteViews];
          return dispatch(
            setSLPDetails(totalHits, newStateData, aggregates, fixedAggregates)
          );
        } else {
          return dispatch(
            setSLPDetails(
              totalHits,
              sellerHomeLiteViews,
              aggregates,
              fixedAggregates
            )
          );
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(setListingPageLoading(false));
        return dispatch(setListingPageFailed(error));
      });
  };
};

export const getSPLPDetails = (queryResult, prevStateData = false) => {
  return (dispatch) => {
    // dispatch(setListingPageLoading(true));
    return fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + "/splpv2?" + queryResult,
      {
        method: "GET",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw (
            res.statusText || "Error while fetching seller listing details."
          );
        }
      })
      .then((result) => {
        
        let {
          totalHits = 0,
          products = [],
          aggregates = [],
          fixedAggregates = {},
        } = result;
        dispatch(setListingPageLoading(false));
        if (prevStateData) {
          let newStateData = [...prevStateData, ...products];
          return dispatch(
            setSLPDetails(totalHits, newStateData, aggregates, fixedAggregates)
          );
        } else {
          return dispatch(
            setSLPDetails(totalHits, products, aggregates, fixedAggregates)
          );
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(setListingPageLoading(false));
        return dispatch(setListingPageFailed(error));
      });
  };
};

export const getListingPage = (token, queryResult, prevStateData = false) => {
  return (dispatch) => {
    dispatch(setListingPageLoading(true));
    return fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/seller-homev2/?" + queryResult,
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
          throw (
            res.statusText || "Error while fetching seller listing details."
          );
        }
      })
      .then((result) => {
        let { count = 0, content = [] } = result;
        dispatch(setListingPageLoading(false));
        if (prevStateData) {
          let newStateData = [...prevStateData, ...content];
          return dispatch(setListingPage(count, newStateData));
        } else {
          return dispatch(setListingPage(count, content));
        }
      })
      .catch((error) => {
        dispatch(setListingPageLoading(false));
        return dispatch(setListingPageFailed(error));
      });
  };
};

export const getSellerDetails = (token, sellerId, verificationStatus = "") => {
  return (dispatch) => {
    let url = process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/" + sellerId;
    if (verificationStatus) {
      url =
        process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
        "/" +
        sellerId +
        "?status=" +
        verificationStatus;
    }
    dispatch(setListingPageLoading(true));
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: token?`Bearer ${token}`:"Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MTIyNTU0MjgsImlhdCI6MTYwNDQ3OTQyOCwianRpIjoiZWUxMjk1YTMtNTlmMi00MzRlLTk3NjMtZTY5MzBiZThkZDAwIiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiYTIwMTg5YTYtNjgzZC00YjI3LWI3ZDktMmFmNTA3MzY4Y2QzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4wLjQyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtcmVhY3R1aSIsImNsaWVudEFkZHJlc3MiOiIxMC4yLjAuNDIifQ.V6-7rnSb6RxhxwsDolIMx6MtdUUSoZjOsFIAF5S9f8OCCm_MCeane_xQYqR_49jZ8S2eiTk829n6UtVmr-ogtrtb0-L9akHw_8JyNDErd2yir0vQODjgJgVrMvgHrbywzD536n4Xv610pQWmnCfCUGgezTthwf5-I0sek0ZvSAYg0EnUcs4TcrSfG7Raqx_-32ngWORriOub6OXdA7gNwINJ0_WBtghz5OfG1gEP9kBZGJK5Ze-02qv_I2ioQo0E7dt7sMYS7cjbhzxCuHllaM1-3MNdkJ1GfW9g66LIcal7JdR0RVzQvqXjoUlz_SohSegGAC19gwojD8G9nc3FTw",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw (
            res.statusText || "Error while fetching seller listing details."
          );
        }
      })
      .then((result) => {
        dispatch(setListingPageLoading(false));
        return dispatch(setSellerDetails(result));
      })
      .catch((error) => {
        // console.log(error);
        dispatch(setListingPageLoading(false));
        return dispatch(setListingPageFailed(error));
      });
  };
};

export const getProductSellerDetails = (token, sellerId) => {
  return (dispatch) => {
    let url =
      process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
      "/seller-home/internal-views?view=SPLP&id=" +
      sellerId;

    dispatch(setListingPageLoading(true));
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: token?`Bearer ${token}`:"Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MTIyNTU0MjgsImlhdCI6MTYwNDQ3OTQyOCwianRpIjoiZWUxMjk1YTMtNTlmMi00MzRlLTk3NjMtZTY5MzBiZThkZDAwIiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiYTIwMTg5YTYtNjgzZC00YjI3LWI3ZDktMmFmNTA3MzY4Y2QzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4wLjQyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtcmVhY3R1aSIsImNsaWVudEFkZHJlc3MiOiIxMC4yLjAuNDIifQ.V6-7rnSb6RxhxwsDolIMx6MtdUUSoZjOsFIAF5S9f8OCCm_MCeane_xQYqR_49jZ8S2eiTk829n6UtVmr-ogtrtb0-L9akHw_8JyNDErd2yir0vQODjgJgVrMvgHrbywzD536n4Xv610pQWmnCfCUGgezTthwf5-I0sek0ZvSAYg0EnUcs4TcrSfG7Raqx_-32ngWORriOub6OXdA7gNwINJ0_WBtghz5OfG1gEP9kBZGJK5Ze-02qv_I2ioQo0E7dt7sMYS7cjbhzxCuHllaM1-3MNdkJ1GfW9g66LIcal7JdR0RVzQvqXjoUlz_SohSegGAC19gwojD8G9nc3FTw",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw (
            res.statusText || "Error while fetching seller listing details."
          );
        }
      })
      .then((result) => {
        dispatch(setListingPageLoading(false));
        return dispatch(setSellerDetails(result));
      })
      .catch((error) => {
        // console.log(error);
        dispatch(setListingPageLoading(false));
        return dispatch(setListingPageFailed(error));
      });
  };
};

export const getProductDetails = (token, articleId = "") => {
  return (dispatch) => {
    let url =
      process.env.NEXT_PUBLIC_REACT_APP_API_PRODUCT_DESCRIPTION_URL +
      "/products/" +
      articleId;

    dispatch(setListingPageLoading(true));
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: token?`Bearer ${token}`:"Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MTIyNTU0MjgsImlhdCI6MTYwNDQ3OTQyOCwianRpIjoiZWUxMjk1YTMtNTlmMi00MzRlLTk3NjMtZTY5MzBiZThkZDAwIiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiYTIwMTg5YTYtNjgzZC00YjI3LWI3ZDktMmFmNTA3MzY4Y2QzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4wLjQyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtcmVhY3R1aSIsImNsaWVudEFkZHJlc3MiOiIxMC4yLjAuNDIifQ.V6-7rnSb6RxhxwsDolIMx6MtdUUSoZjOsFIAF5S9f8OCCm_MCeane_xQYqR_49jZ8S2eiTk829n6UtVmr-ogtrtb0-L9akHw_8JyNDErd2yir0vQODjgJgVrMvgHrbywzD536n4Xv610pQWmnCfCUGgezTthwf5-I0sek0ZvSAYg0EnUcs4TcrSfG7Raqx_-32ngWORriOub6OXdA7gNwINJ0_WBtghz5OfG1gEP9kBZGJK5Ze-02qv_I2ioQo0E7dt7sMYS7cjbhzxCuHllaM1-3MNdkJ1GfW9g66LIcal7JdR0RVzQvqXjoUlz_SohSegGAC19gwojD8G9nc3FTw",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw (
            res.statusText || "Error while fetching seller listing details."
          );
        }
      })
      .then((result) => {
        dispatch(setListingPageLoading(false));
        return dispatch(setProductDetails(result));
      })
      .catch((error) => {
        dispatch(setListingPageLoading(false));
        return dispatch(setListingPageFailed(error));
      });
  };
};

export const getPLPDetails = (
  queryResult,
  loader = false,
  prevStateData = false
) => {
  return (dispatch) => {
    if (loader) dispatch(setListingPageLoading(true));
    return fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + "/plpv2?" + queryResult,
      {
        method: "GET",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw (
            res.statusText || "Error while fetching seller listing details."
          );
        }
      })
      .then((result) => {
        let {
          totalHits = 0,
          products = [],
          aggregates = [],
          fixedAggregates = {},
        } = result;
        dispatch(setListingPageLoading(false));
        if (prevStateData) {
          let newStateData = [...prevStateData, ...products];
          return dispatch(
            setSLPDetails(totalHits, newStateData, aggregates, fixedAggregates)
          );
        } else {
          return dispatch(
            setSLPDetails(totalHits, products, aggregates, fixedAggregates)
          );
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(setListingPageLoading(false));
        return dispatch(setListingPageFailed(error));
      });
  };
};
