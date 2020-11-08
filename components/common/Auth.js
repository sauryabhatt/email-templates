import React, {useState,useEffect} from 'react'
import {useKeycloak} from '@react-keycloak/ssr';
import {loginToApp} from "../AuthWithKeycloak";
import Spinner from "../Spinner/Spinner";
import Cookies from 'js-cookie'

function Auth ({children}){
    const { keycloak } = useKeycloak();
    console.log("its server keycloak", keycloak);
    const [status, setStatus] = useState(undefined);
    useEffect(() => {
        if(!keycloak.authenticated) {
            setStatus("loggedout");
        } else {
        console.log("i am in if", keycloak)
        setStatus("loggedin");
        }
    }, []);

    if(status === undefined) {
        console.log("this is server")
        return <p>Loading...</p>
    } else if (status === "loggedout") {
        console.log("this is logout")
        loginToApp(keycloak, {currentPath:"/cart"});
        return <Spinner/>;
    } else if (status === "loggedin") {
        console.log("this is login")
        return children;
    } else {
        return undefined;
    }

}

export default Auth;
