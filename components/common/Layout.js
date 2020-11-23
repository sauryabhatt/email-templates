import { useState, Fragment, useEffect} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {useKeycloak  } from '@react-keycloak/ssr';
import UserHeader from "../UserHeader/UserHeader";
import AppHeader from "../AppHeader/AppHeader";
import Ribbon from "../Ribbon/Ribbon";
import {setAuth, getUserProfile} from '../../store/actions';
import store from '../../store';
import _ from "lodash";

export const Layout = ({
  children,
  meta = {},
}) => {

  const [isShowRibbon, setShowRibbon] = useState(true)
  const { keycloak } = useKeycloak()
  const router = useRouter();
  const pathname = router?.pathname ?? "/";
  const title = meta?.title || "";
  const description = meta?.description || "";
  const keywords = meta?.keywords || "";
  const Header = keycloak.authenticated ? <UserHeader isShowRibbon = {isShowRibbon}/> : <AppHeader isShowRibbon = {isShowRibbon}/>;
  let url = pathname.indexOf("cart") >= 0 ||  pathname.indexOf("payment-success") >= 0 || pathname.indexOf("notfound") >= 0|| pathname.indexOf("shipping") >= 0||  pathname.indexOf("signup") >= 0||  pathname.indexOf("payment") >= 0   ? true : false;

  useEffect(() => {
    
    if(keycloak?.token){
      
      document.cookie = `appToken=${keycloak.token}`
      
      keycloak.loadUserProfile().then((profile) => {
        store.dispatch(setAuth(keycloak.authenticated, profile));
        }).catch((error) => {
            store.dispatch(setAuth(keycloak.authenticated, null));
            // router.push('/error?message="Somthing went wrong on loading user profile."&redirectURI='+router.pathname);
        });
        store.dispatch(getUserProfile(keycloak.token));
    }
  }, [keycloak.token])
  
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={`${pathname}`} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/*remove the below two lines in production*/}
        <meta name="robots" content="noindex" />
        <meta name="googlebot" content="noindex" />
        <script src="https://www.paypal.com/sdk/js?client-id=AUf6Jh8viomIa90m8KMFndz2iIwKkIcpzZHTUmKY1f8M9J7uDeQ1zO7d-lTb85AU4oiBHBlb2mBZ9g9_&currency=USD&intent=order" id="paypal-script" type="text/javaScript"></script>
      </Head>
      {isShowRibbon && !url  ? <Ribbon isShowRibbon = {isShowRibbon} setShowRibbon = {setShowRibbon}/> : null}
      {Header}
     {<main className="main-layout-next">{children}</main>}
    </Fragment>
  ) 
};
