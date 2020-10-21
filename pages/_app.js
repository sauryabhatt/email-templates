import '../styles/globals.css'
import { useEffect} from "react";
import 'antd/dist/antd.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ErrorHandler from '../components/ErrorHandler';
import AppFooter from '../components/AppFooter/AppFooter';
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import AuthWithKeycloak from '../components/AuthWithKeycloak';
import {getToken} from '../components/taskBeforeLoad';
import Spinner from '../components/Spinner/Spinner'; 
import { Provider } from 'react-redux';
import cookie from 'cookie'
import Cookies from 'js-cookie'
import store  from '../store';
import { setTokenSuccess, setTokenFail } from '../store/actions';
import {useRouter} from 'next/router';

let timeSkew = 10;
const generateToken=async ()=>{
  const result = {isSuccess:undefined, token:undefined};
  const details = {
    grant_type: "client_credentials",
    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    client_secret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET
  };   

  let formBody = [];   

  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  
  formBody = formBody.join("&");
    try {
      const response =  await fetch((process.env.REACT_APP_KEYCLOAK_URL + "realms/" + process.env.REACT_APP_KEYCLOAK_REALM + "/protocol/openid-connect/token"), {
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
  
  
}
function MyApp(props) {
  const router = useRouter();  
  
  const { Component, pageProps, cookies, token, isTokenGenerationFailed,req } = props;

  useEffect(() => {
    if(isTokenGenerationFailed) {
      store.dispatch(setTokenFail("Somthing went wrong on loading application token."));
    } else {
      store.dispatch(setTokenSuccess(token));
    }
    
  }, [])

    return (
      <AuthWithKeycloak cookies = {cookies}>
        <Provider store={store}>
          <React.Fragment>
            <Component {...pageProps} />
            <AppFooter/>
          </React.Fragment>
        </Provider>
      </AuthWithKeycloak>
      );
}
function parseCookies(req) {
  if (!req || !req.headers) {
    return {}
  }
  return cookie.parse(req.headers.cookie || '')
}

MyApp.getInitialProps = async ({ctx}) => {
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
  
  
}

export default MyApp


