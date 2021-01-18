/** @format */

import { useEffect } from "react";
import "antd/dist/antd.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/globals.css";
import AppFooter from "../components/AppFooter/AppFooter";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import AuthWithKeycloak from "../components/AuthWithKeycloak";
import { Provider } from "react-redux";
import cookie from "cookie";
import TagManager from "react-gtm-module";
import store from "../store";
import { useRouter } from "next/router";

function MyApp(props) {
  const router = useRouter();

  const { Component, pageProps, cookies } = props;

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
    <AuthWithKeycloak cookies={cookies}>
      <Provider store={store}>
        <React.Fragment>
          <ScrollToTop>
            <Component {...pageProps} />
            <AppFooter />
          </ScrollToTop>
        </React.Fragment>
      </Provider>
    </AuthWithKeycloak>
  );
}
function parseCookies(req) {
  if (!req || !req.headers) {
    return {};
  }
  let cookies = cookie.parse(req.headers.cookie || "");
  let appToken = cookies.appToken;
  let appTokenCookie = cookie.serialize("appToken", appToken, {
    path: "/",
  });
  return appTokenCookie;
  // if (!req || !req.headers) {
  //   return {};
  // }
  // return cookie.parse(req.headers.cookie || "");
}

MyApp.getInitialProps = async ({ ctx }) => {
  const { req, res } = ctx || {};

  return {
    cookies: parseCookies(req),
  };
};

export default MyApp;
