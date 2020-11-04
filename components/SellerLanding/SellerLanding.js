/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SellerLandingDesktop from "./SellerLandingDesktop";
import SellerLandingMobile from "../mobile/SellerLandingMobile";
import { getSellerDetails } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
const isServer = () => typeof window == undefined;

const SellerLanding = (props) => {
  let data = !isServer() ? props.sellerDetails : props.data.sellerDetails;
  const router = useRouter();
  let { sellerId: sellerIdParam } = router.query;

  let { userProfile = {}, isLoading = true } = props;

  let { orgName = "", categoryDescs = [], productTypeDescs = [] } = data || {};

  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );

  const { keycloak } = useKeycloak();
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
      props.getSellerDetails(
        keycloak.token,
        sellerIdParam?.toLowerCase(),
        verificationStatus
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
            Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MDQ0Mjc1MDMsImlhdCI6MTYwNDM5ODcwMywianRpIjoiOTUwMTNjNWItMGVkMS00Y2UxLWIxMzUtNDZjNjJmN2UyZjY3IiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiZTcxYjY5MDYtNTk1NS00ZjFiLThhMDctMGE4OWE5NzcwMjRhIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4xLjIwOCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LXJlYWN0dWkiLCJjbGllbnRBZGRyZXNzIjoiMTAuMi4xLjIwOCJ9.ZPl2AP5tiQcoc9SfGXZokJtjME1qXehu_-7lrpXetWryBKWnVbdsi5VlD1erfEDc399zbu8mgiGo-eR_xm2o_VIW2ilTP7dbGCKsBL3hrjzP1BrRncsoYQGl1SfaTRmK4Zln9ZyJhkmH5m1qy-6W_gPLxqIoFZfj7klub96j5gtVVVuO7ZDkXR-cByNgdjUuLktrbe-navNSDVWgNG374mnhb2D7_OSAurWXAlOAkhRGREzRDCVilpqRh7qFVlgqwGPoPAG7dl9NCiuDkf0EGYgU0q4I8DH65g_Jk4RCK9p0dXAfFZ0KVD7ujacsGGvSBybXqahFTbD-MoYhJkCiOQ",
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
            Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MDQ0Mjc1MDMsImlhdCI6MTYwNDM5ODcwMywianRpIjoiOTUwMTNjNWItMGVkMS00Y2UxLWIxMzUtNDZjNjJmN2UyZjY3IiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiZTcxYjY5MDYtNTk1NS00ZjFiLThhMDctMGE4OWE5NzcwMjRhIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4xLjIwOCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LXJlYWN0dWkiLCJjbGllbnRBZGRyZXNzIjoiMTAuMi4xLjIwOCJ9.ZPl2AP5tiQcoc9SfGXZokJtjME1qXehu_-7lrpXetWryBKWnVbdsi5VlD1erfEDc399zbu8mgiGo-eR_xm2o_VIW2ilTP7dbGCKsBL3hrjzP1BrRncsoYQGl1SfaTRmK4Zln9ZyJhkmH5m1qy-6W_gPLxqIoFZfj7klub96j5gtVVVuO7ZDkXR-cByNgdjUuLktrbe-navNSDVWgNG374mnhb2D7_OSAurWXAlOAkhRGREzRDCVilpqRh7qFVlgqwGPoPAG7dl9NCiuDkf0EGYgU0q4I8DH65g_Jk4RCK9p0dXAfFZ0KVD7ujacsGGvSBybXqahFTbD-MoYhJkCiOQ",
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
