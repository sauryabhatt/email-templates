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
    // console.log("Inside auth ", keycloak.authenticated, getCookie("appToken"));

    if (getCookie("appToken")) {
      console.log("Already logged in!!");
    } else {
      console.log("Not logged in!!");
      if (keycloak?.authenticated) {
        console.log("Logging in!!");
      }
    }
    if (keycloak?.token) {
      document.cookie = `appToken=${keycloak.token}`;
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
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
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
        {/*remove the below two lines in production*/}
        <meta name="robots" content="noindex" />
        <meta name="googlebot" content="noindex" />
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_URL}/favicon.ico?v=2`}
        />
        <script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_REACT_APP_PAYPAL_CLIENT_ID}&currency=USD&intent=order`}
          id="paypal-script"
          type="text/javaScript"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({
        'gtm.start':
        new Date().getTime(), event: 'gtm.js'
        }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-KTVSR8R');`,
          }}
        ></script>
      </Head>
      {isShowRibbon && !url ? (
        <Ribbon isShowRibbon={isShowRibbon} setShowRibbon={setShowRibbon} />
      ) : null}
      {Header}
      {<main className="main-layout-next">{children}</main>}
    </Fragment>
  );
};
