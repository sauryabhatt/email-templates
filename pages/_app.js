/** @format */

import { useEffect } from "react";
import "antd/dist/antd.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/globals.css";
import ErrorHandler from "../components/ErrorHandler";
import AppFooter from "../components/AppFooter/AppFooter";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import AuthWithKeycloak from "../components/AuthWithKeycloak";
import { getToken } from "../components/taskBeforeLoad";
import Spinner from "../components/Spinner/Spinner";
import { Provider } from "react-redux";
import cookie from "cookie";
import TagManager from "react-gtm-module";
import Cookies from "js-cookie";
import store from "../store";
import { setTokenSuccess, setTokenFail } from "../store/actions";
import { useRouter } from "next/router";
import { getCookie } from "../components/common/Auth";

function MyApp(props) {
  const router = useRouter();

  const { Component, pageProps, cookies } = props;

  // useEffect(() => {
  //   if(isTokenGenerationFailed) {
  //     store.dispatch(setTokenFail("Somthing went wrong on loading application token."));
  //   } else {
  //     store.dispatch(setTokenSuccess(token));
  //   }

  // }, [])
  // const [cookie, setCookie] = useCookies(["userID"]);

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
  console.log("Parse cookie ", req);
  if (!req || !req.headers) {
    return {};
  }
  if (!getCookie("appToken")) {
    return cookie.parse(req.headers.cookie || "");
  } else {
    return {};
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  const { req, res } = ctx || {};

  return {
    cookies: parseCookies(req),
  };
};

export default MyApp;

/*let timeSkew = 10;
const generateToken=async ()=>{
  const result = {isSuccess:undefined, token:undefined};
  const details = {
    grant_type: "client_credentials",
    client_id: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_CLIENT_SECRET
  };   

  let formBody = [];   

  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(details[property]);
    formBod[y.push(encodedKey + "=" + encodedValue);
  }
  
  formBody = formBody.join("&");
    try {
      const response =  await fetch((process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_URL + "realms/" + process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_REALM + "/protocol/openid-connect/token"), {
        method: "POST",
        body: formBody,
        credentials:"include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
        });
      
        const res = await response.json();

        res['requestedTimestamp'] = Math.floor(Date.now()/1000);
        

        result["isSuccess"] = true;
        result["token"] = res;
        return result;
    } catch (error) {
      result["isSuccess"] = false;
      result["token"] = undefined;

      return result
    }
  
  
} */

/*MyApp.getInitialProps = async ({ctx}) => {
  // Extract token from AppContext
  const {req, res} = ctx || {};
  // const headers = req.headers; 
  //making conditions for checking token expiration and token existence

let token, isTokenGenerationFailed;
  if(parseCookies(req).appToken){
    //if request header has token
    const oldToken = parseCookies(req).appToken;
    if((oldToken.requestedTimestamp && oldToken.expires_in && (oldToken.requestedTimestamp + oldToken.expires_in - timeSkew) <= Math.floor(Date.now()/1000)) || !(oldToken.requestedTimestamp && oldToken.expires_in)) {
      //if token is expired
      const result  = await generateToken();
      if(result.isSuccess) {
        token = result.token;
        req.headers["Authorization"]=`Bearer ${token.access_token}`;
      } else {
        isTokenGenerationFailed = true;
      }
    } else {
      //if token is not expired
      token = oldToken;
              req.headers["Authorization"]=`Bearer ${token.access_token}`;


    }
  }else {
    //if request header does not have token
    const result = await generateToken();
    if(result.isSuccess) {
      token = result.token;
              req.headers["Authorization"]=`Bearer ${token.access_token}`;

    } else {
      isTokenGenerationFailed = true
    }

  } 
     
// console.log("-->",req.headers);
      
  return {
    cookies: parseCookies(req),
    isTokenGenerationFailed,
    token,
  }
  
  
} */
