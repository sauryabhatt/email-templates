import React, {useState,useEffect, useRef} from 'react'
import {useKeycloak} from '@react-keycloak/ssr';
import {loginToApp} from "../AuthWithKeycloak";
import Spinner from "../Spinner/Spinner";

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
    }
    return "";
}

function Auth ({children, path}){
    const { keycloak } = useKeycloak();
    const didMountRef = useRef(false);
    const [status, setStatus] = useState(undefined);
    const [mounted, setmounted] = useState(false);
    
    useEffect(() => {

    if(getCookie("appToken")) {
        setStatus("loggedin"); 
    } else {
        setStatus("loggedout");
    }

    }, [keycloak.authenticated, keycloak.token]);

    if(status === undefined) {
        return <Spinner/>;
    } else if (status === "loggedout") {
        setTimeout(() => {
            if(status==="loggedin") {
                return children;
            } else {
            loginToApp(keycloak, {currentPath:path});
            }
        }, 200);
        return <Spinner/>;
    } else if (status === "loggedin") {
        return children;
    } else {
        return <Spinner/>;
    }

}

export default Auth;
