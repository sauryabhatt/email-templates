import { Fragment} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {useKeycloak  } from '@react-keycloak/ssr';
import UserHeader from "../UserHeader/UserHeader";
import AppHeader from "../AppHeader/AppHeader";
export const Layout = ({
  children,
  navigationItem,
  meta = {},
}) => {
  const { keycloak } = useKeycloak()
  const router = useRouter();
  const pathname = router?.pathname ?? "/";
  const title = meta?.title || "";
  const description = meta?.description || "";
  const keywords = meta?.keywords || "";
  // const Header = keycloak.authenticated ? <UserHeader response={navigationItem}/> : <AppHeader response={navigationItem}/>;
  
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
        <meta name="robots" content="noindex" />
        <meta name="googlebot" content="noindex" />
        <meta
          name="keywords"
          content={keywords}
        />
      </Head>
      <main className="main-layout-next">{children}</main>
    </Fragment>
  ) 
};
