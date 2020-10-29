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
        "/seller-home?" +
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
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
        "/splp?" +
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
      process.env.REACT_APP_API_PROFILE_URL + "/seller-home/?" + queryResult,
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
    let url = process.env.REACT_APP_API_PROFILE_URL + "/" + sellerId;
    if (verificationStatus) {
      url =
        process.env.REACT_APP_API_PROFILE_URL +
        "/" +
        sellerId +
        "?status=" +
        verificationStatus;
    }
    dispatch(setListingPageLoading(true));
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
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
      process.env.REACT_APP_API_PROFILE_URL +
      "/seller-home/internal-views?view=SPLP&id=" +
      sellerId;

    dispatch(setListingPageLoading(true));
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
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
        Authorization: "Bearer " + token,
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
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
        "/plp?" +
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
