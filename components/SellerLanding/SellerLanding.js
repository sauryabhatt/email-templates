/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SellerLandingDesktop from "./SellerLandingDesktop";
import SellerLandingMobile from "../mobile/SellerLandingMobile";
import { getSellerDetails } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import _ from "lodash";
const isServer = () => typeof window == "undefined";

const SellerLanding = (props) => {
  const router = useRouter();
  let { sellerId: sellerIdParam } = router.query;
  let { userProfile = {}, isLoading = true } = props;

  const { keycloak } = useKeycloak();
  const [mobile, setMobile] = useState(false);
  const [sellerSubscriptions, setSellerSubscriptions] = useState([]);
  const [aboutCompany, setAboutCompany] = useState(props.data.about);
  const [productPopupDetails, setProductPopupDetails] = useState(
    props.data.category_product_range
  );
  const [sellerDetails, setSellerDetails] = useState(props.data.sellerDetails);

  let app_token = null;

  if (keycloak.token) {
    app_token = keycloak.token;
  } else {
    app_token = process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN;
  }

  useEffect(() => {
    props.getSellerDetails(
      app_token,
      sellerIdParam?.toLowerCase(),
      false,
      (result) => {
        setSellerDetails(result);
        console.log(result);
        let id = result?.id?.replace("HOME::", "");
        id = id?.replace("SELLER::", "");
        console.log("dsss ", id);
        fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL}/seller-home/ABOUT::SELLER::${id}/about`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + app_token,
            },
          }
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              throw (
                res.statusText || "Oops something went wrong. Please try again!"
              );
            }
          })
          .then((result) => {
            console.log("RR ", result);
            let aboutCompany =
              result.length > 0 ? result[0]["htmlContent"] : "";
            setAboutCompany(aboutCompany);
          })
          .catch((err) => {
            console.log(err.message);
          });

        fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_COLLECTION_URL}/recently/viewed/add/seller?seller_code=${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + app_token,
            },
          }
        )
          .then((res) => {
            if (res.ok) {
              console.log("Added seller to recently viewed");
            } else {
              throw (
                res.statusText || "Oops something went wrong. Please try again!"
              );
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    );
  }, [router.query]);

  useEffect(() => {
    let width = window.screen ? window.screen.width : window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }

    if (props.userProfile) {
      let { verificationStatus = "", profileType = "" } = props.userProfile;
      props.getSellerDetails(
        app_token,
        sellerIdParam?.toLowerCase(),
        verificationStatus,
        (result) => {
          setSellerDetails(result);
        }
      );

      if (profileType === "BUYER" && verificationStatus === "IN_PROGRESS") {
        fetch(
          process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
            "/profiles/my/subscriptions",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + keycloak.token,
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
          .then((response) => {
            setSellerSubscriptions(response["sellerSubscriptions"]);
          })
          .catch((err) => {
            // console.log("Error ", err);
          });
      }
    }
  }, [props.userProfile]);

  const categoryRange = () => {
    let productTypes = _.groupBy(props.data.category_product_range, "l2Desc");

    let values = [];
    for (let list in productTypes) {
      let obj = {};
      obj["productType"] = list;
      let pDetails = "";
      let l1Desc = "";
      for (let items of productTypes[list]) {
        let { productTypeDesc = "" } = items;
        l1Desc = items["l1Desc"];
        pDetails = pDetails + productTypeDesc + ", ";
      }
      let pName = pDetails.trim().slice(0, -1);
      obj["productName"] = pName;
      obj["l1Desc"] = l1Desc;
      values.push(obj);
    }
    return values;
  };
  return (
    <div>
      {mobile ? (
        <SellerLandingMobile
          data={!isServer() ? sellerDetails : props.data.sellerDetails}
          isLoading={isServer() ? isLoading : false}
          userProfile={userProfile}
          token={app_token}
          sellerSubscriptions={sellerSubscriptions}
          aboutCompany={!isServer() ? aboutCompany : props.data.about}
          productPopupDetails={
            !isServer() ? productPopupDetails : categoryRange()
          }
          sellerIdentity={(sellerDetails && sellerDetails.kcIdentityId) || null}
        />
      ) : (
        <SellerLandingDesktop
          data={!isServer() ? sellerDetails : props.data.sellerDetails}
          isLoading={isServer() ? isLoading : false}
          userProfile={userProfile}
          token={app_token}
          sellerSubscriptions={sellerSubscriptions}
          productPopupDetails={
            !isServer() ? productPopupDetails : categoryRange()
          }
          aboutCompany={!isServer() ? aboutCompany : props.data.about}
          sellerIdentity={(sellerDetails && sellerDetails.kcIdentityId) || null}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile.userProfile,
    isLoading: state.sellerListing.isLoading,
  };
};

export default connect(mapStateToProps, { getSellerDetails })(SellerLanding);
