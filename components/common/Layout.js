/** @format */

import { useState, Fragment, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useKeycloak } from "@react-keycloak/ssr";
import UserHeader from "../UserHeader/UserHeader";
import AppHeader from "../AppHeader/AppHeader";
import Ribbon from "../Ribbon/Ribbon";
import { setAuth, getUserProfile } from "../../store/actions";
import store from "../../store";
import _ from "lodash";
import { getCookie } from "../common/Auth";

export const Layout = ({ children, meta = {} }) => {
  const [isShowRibbon, setShowRibbon] = useState(true);
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const pathname = router?.pathname ?? "/";
  const title = meta?.title || "";
  const description = meta?.description || "";
  const keywords = meta?.keywords || "";
  const Header = keycloak.authenticated ? (
    <UserHeader isShowRibbon={isShowRibbon} />
  ) : (
    <AppHeader isShowRibbon={isShowRibbon} />
  );
  let url =
    pathname.indexOf("cart") >= 0 ||
    pathname.indexOf("payment-success") >= 0 ||
    pathname.indexOf("notfound") >= 0 ||
    pathname.indexOf("shipping") >= 0 ||
    pathname.indexOf("signup") >= 0 ||
    pathname.indexOf("payment") >= 0
      ? true
      : false;

  useEffect(() => {
    if (!getCookie("appToken")) {
      if (keycloak?.authenticated) {
        keycloak
          .loadUserProfile()
          .then((profile) => {
            const { attributes: { parentProfileId = [] } = {} } = profile;
            let profileId = parentProfileId[0] || "";
            profileId = profileId.replace("BUYER::", "");
            profileId = profileId.replace("SELLER::", "");
            fetch(
              process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
                "/profiles/" +
                profileId +
                "/events/login",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + keycloak.token,
                },
              }
            )
              .then((res) => {
                if (res.ok) {
                  return res.json();
                } else {
                  throw res.statusText || "Error while getting user deatils.";
                }
              })
              .then((res) => {
                return true;
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((error) => {
            console.log("error ", error);
          });
      }
    }

    if (keycloak?.token) {
      if (!getCookie("appToken")) {
        document.cookie = `appToken=${keycloak.token}; path=/;`;
      }

      keycloak
        .loadUserProfile()
        .then((profile) => {
          store.dispatch(setAuth(keycloak.authenticated, profile));
        })
        .catch((error) => {
          store.dispatch(setAuth(keycloak.authenticated, null));
          // router.push('/error?message="Somthing went wrong on loading user profile."&redirectURI='+router.pathname);
        });
      store.dispatch(getUserProfile(keycloak.token));
    }
  }, [keycloak.token]);

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        {title && <meta property="og:title" content={title} />}
        {meta?.url && (
          <meta
            property="og:url"
            content={`https://www.qalara.com${meta.url}`}
          />
        )}
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {process.env.NODE_ENV !== "production" && (
          <>
            <meta name="robots" content="noindex" />
            <meta name="googlebot" content="noindex" />
          </>
        )}
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_REACT_APP_CDN_URL}/images/Img_Favicon_Public.ico`}
        />
        <script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_REACT_APP_PAYPAL_CLIENT_ID}&currency=USD&intent=order`}
          id="paypal-script"
          type="text/javaScript"
        ></script>
      </Head>
      {isShowRibbon && !url ? (
        <Ribbon
          isShowRibbon={isShowRibbon}
          setShowRibbon={(flag) => setShowRibbon(flag)}
        />
      ) : null}
      {Header}
      {<main className="main-layout-next">{children}</main>}
    </Fragment>
  );
};
