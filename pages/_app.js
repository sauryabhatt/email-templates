/** @format */

import { useEffect } from "react";
import { SSRKeycloakProvider, SSRCookies } from "@react-keycloak/ssr";
import "antd/dist/antd.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/globals.css";
import AppFooter from "../components/AppFooter/AppFooter";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import { Provider } from "react-redux";
import cookie from "cookie";
import TagManager from "react-gtm-module";
import store from "../store";

const keycloak = {
  url: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_CLIENT_ID,
};

const initOptions = {
  onLoad: "check-sso",
  checkLoginIframe: false,
  silentCheckSsoRedirectUri:
    process.env.NEXT_PUBLIC_URL + "/silent-check-sso.html",
};

function MyApp({ Component, pageProps, cookies }) {
  // Google Tag Manager
  useEffect(() => {
    TagManager.initialize({ gtmId: "GTM-KTVSR8R" });
  }, []);

  useEffect(() => {
    let Tawk_API = Tawk_API || {},
      Tawk_LoadStart = new Date();
    (function () {
      let s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/5fdb39afdf060f156a8df4ae/1epo5ilog";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloak}
      persistor={SSRCookies(cookies)}
      initOptions={initOptions}
    >
      <Provider store={store}>
        <React.Fragment>
          <ScrollToTop>
            <Component {...pageProps} />
            <AppFooter />
          </ScrollToTop>
        </React.Fragment>
      </Provider>
    </SSRKeycloakProvider>
  );
}

function parseCookies(request) {
  if (!request || !request.headers) {
    return {};
  }
  return cookie.parse(request.headers.cookie || "");
}

MyApp.getInitialProps = async (context) => {
  return {
    cookies: parseCookies(context?.ctx?.req),
  };
};

export default MyApp;
