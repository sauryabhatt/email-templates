/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SellerLandingDesktop from "./SellerLandingDesktop";
import SellerLandingMobile from "../mobile/SellerLandingMobile";
import { getSellerDetails } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useSelector } from "react-redux";
import {useRouter} from "next/router";
const isServer = () => typeof window == undefined;

const SellerLanding = (props) => {
  let data = !isServer()?props.sellerDetails:props.data.sellerDetails;
  const router = useRouter();
  let { sellerId:sellerIdParam } = router.query;


  let { userProfile = {}, isLoading = true } = props;

  let { orgName = "", categoryDescs = [], productTypeDescs = [] } = data || {};

  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );

  const {keycloak} = useKeycloak();
  const [mobile, setMobile] = useState(false);
  const [sellerId, setSellerId] = useState("");
  const [sellerSubscriptions, setSellerSubscriptions] = useState([]);
  const [aboutCompany, setAboutCompany] = useState("");
  const [productPopupDetails, setProductPopupDetails] = useState("");
  // const [identityId, setIdentityId] = useState(null)
  
  useEffect(() => {
    let width = window.screen ? window.screen.width : window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }
    // let queryParams = props.match.params;
    // let { sellerId = "" } = queryParams;
    // sellerId = sellerId.toLowerCase();
    // setIdentityId(props.userProfile.kcIdentityId)

    if (keycloak.token && props.userProfile) {
      let { verificationStatus = "", profileType = "" } = props.userProfile;
      props.getSellerDetails(keycloak.token, sellerIdParam?.toLowerCase(), verificationStatus);

      if (profileType === "BUYER" && verificationStatus === "IN_PROGRESS") {
        fetch(
          process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/profiles/my/subscriptions",
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
    } else if (!keycloak.authenticated) {
      props.getSellerDetails(token, sellerIdParam?.toLowerCase());
    }
  }, [props.userProfile]);

  useEffect(() => {
    if (props.sellerDetails) {
      let userToken = keycloak.token || token;
      let { id = "" } = props.sellerDetails;
      id = id.replace("HOME::", "");
      setSellerId(id);
      fetch(
        process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
          "/seller-home/ABOUT::" +
          id +
          "/about",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + userToken,
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
          let aboutCompany =
            response.length > 0 ? response[0]["htmlContent"] : "";
          setAboutCompany(aboutCompany);
        })
        .catch((err) => {
          // console.log("Error ", err);
        });

      fetch(
        process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
          "/seller-home/" +
          id +
          "/category-product-range",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + userToken,
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
          setProductPopupDetails(response);
        })
        .catch((err) => {
          // console.log("Error ", err);
        });
    }
  }, [props.sellerDetails]);

  return (
    <div>
      {mobile ? (
        <SellerLandingMobile
          data={data}
          isLoading={isLoading}
          userProfile={userProfile}
          token={keycloak.token || token}
          sellerId={sellerId}
          sellerSubscriptions={sellerSubscriptions}
          aboutCompany={aboutCompany}
          productPopupDetails={productPopupDetails}
          sellerIdentity={
            (props.sellerDetails && props.sellerDetails.kcIdentityId) || null
          }
        />
      ) : ( 
        <SellerLandingDesktop
          data={data}
          isLoading={isLoading}
          userProfile={userProfile}
          token={keycloak.token || token}
          sellerId={sellerId}
          sellerSubscriptions={sellerSubscriptions}
          productPopupDetails={productPopupDetails}
          aboutCompany={aboutCompany}
          sellerIdentity={
            (props.sellerDetails && props.sellerDetails.kcIdentityId) || null
          }
        />
       )} 
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    sellerDetails: state.sellerListing.sellerDetails,
    userProfile: state.userProfile.userProfile,
    isLoading: state.sellerListing.isLoading,
  };
};

export default connect(mapStateToProps, { getSellerDetails })(SellerLanding);
