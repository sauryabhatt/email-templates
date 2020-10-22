import { useState, Fragment, useEffect} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {useKeycloak  } from '@react-keycloak/ssr';
import UserHeader from "../UserHeader/UserHeader";
import AppHeader from "../AppHeader/AppHeader";
import _ from "lodash";

const isServer = () => typeof window == undefined;

export const Layout = ({
  children,
  meta = {},
}) => {
  const { keycloak } = useKeycloak()
  const router = useRouter();
  const [navigationItems, setNavigationItems] = useState({});
  const pathname = router?.pathname ?? "/";
  const title = meta?.title || "";
  const description = meta?.description || "";
  const keywords = meta?.keywords || "";
  const Header = keycloak.authenticated ? <UserHeader nav={navigationItems}/> : <AppHeader nav={navigationItems}/>;

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={`${pathname}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={'sdfdsf'} />
        <meta property="og:name" content="sdfs" />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={`sdfsdfs`} />
        <meta name="twitter:site" content="" />
        <meta name="twitter:creator" content="" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/*remove the below two lines in production*/}
        <meta name="robots" content="noindex" />
        <meta name="googlebot" content="noindex" />
        <meta
          name="keywords"
          content={keywords}
        />
      </Head>
      {Header}
      <main className="main-layout-next">{children}</main>
    </Fragment>
  ) 
};
