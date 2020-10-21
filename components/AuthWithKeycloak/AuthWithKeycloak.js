// import React from 'react';
// import Keycloak from 'keycloak-js';
// import { KeycloakProvider } from '@react-keycloak/web';
// import store from '../../store';
// import {setAuth, getUserProfile} from '../../store/actions';
// import Spinner from '../Spinner/Spinner';

// const keycloak = new Keycloak({
//     realm: process.env.REACT_APP_KEYCLOAK_REALM,
//     url: process.env.REACT_APP_KEYCLOAK_URL,
//     clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
// });

// const keycloakProviderInitConfig = {
//     onLoad: 'check-sso',
//     flow: 'implicit',
// }

// const redirectUriForApp = {
//     '/': '/check-user-status'
// }

// export const loginToApp = (options) => {
//     if (options && options.currentPath) {
//         if(redirectUriForApp[options.currentPath]){
//             keycloak.login({ redirectUri: (process.env.REACT_APP_REDIRECT_APP_DOMAIN + redirectUriForApp[options.currentPath]) });
//         } else {
//             keycloak.login({ redirectUri: (process.env.REACT_APP_REDIRECT_APP_DOMAIN + options.currentPath) });
//         }
//     } else {
//         keycloak.login({ redirectUri: process.env.REACT_APP_REDIRECT_APP_DOMAIN });
//     }

// }

// export const logoutFromApp = (options) => {
//     if (options && options.currentPath) {
//         keycloak.logout({ redirectUri: process.env.REACT_APP_REDIRECT_APP_DOMAIN + options.currentPath });
//     } else {
//         keycloak.logout({ redirectUri: process.env.REACT_APP_REDIRECT_APP_DOMAIN });
//     }
// }

// class AuthWithKeycloak extends React.PureComponent {

//     onKeycloakEvent = (event, error) => {
//         if (event === 'onReady') {
//         } else if (event === 'onAuthSuccess') {
//             keycloak.loadUserProfile().then((profile) => {
//                 store.dispatch(setAuth(keycloak.authenticated, profile));
//             }).catch((error) => {
//                 store.dispatch(setAuth(keycloak.authenticated, null));
//                 history.push('/error?message="Somthing went wrong on loading user profile."&redirectURI='+history.location.pathname);
//             });
//             store.dispatch(getUserProfile(keycloak.token));
//         }
        
//     }

//     onKeycloakTokens = tokens => {
//         // console.log('onKeycloakTokens', tokens)
//     }

//     render() {
        
//         return (
//             <KeycloakProvider
//                 keycloak={keycloak}
//                 initConfig={keycloakProviderInitConfig}
//                 onEvent={this.onKeycloakEvent}
//                 onTokens={this.onKeycloakTokens}
//                 LoadingComponent={<Spinner/>}
//             >
//                 {this.props.children}
//             </KeycloakProvider>
//         )
//     }
// }



// export default AuthWithKeycloak;