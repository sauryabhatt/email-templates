import * as actionTypes from './../types';

export const setAuthLoading = (isLoading) => {
    return {
        type: actionTypes.SET_AUTH_LOADING,
        payload: {
            isLoading: isLoading
        }
    }
}

export const setAuth = (authenticated, userAuth) => {
    return {
        type: actionTypes.SET_AUTH,
        payload: {
            authenticated: authenticated,
            userAuth: userAuth
        }
    }
}