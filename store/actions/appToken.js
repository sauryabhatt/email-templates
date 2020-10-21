import * as actionTypes from './../types';
import Cookie from "js-cookie";
export const setTokenLoading = () => {
    return {
        type: actionTypes.GET_TOKEN_LOADING
    }
}

export const setTokenSuccess = (token) => {
    return {
        type: actionTypes.GET_TOKEN_SUCCESS,
        payload: {
            token: token
        }
    }
}

export const setTokenFail = (errorMessage) => {
    return {
        type: actionTypes.GET_TOKEN_FAIL,
        payload: {
            errorMessage: errorMessage
        }
    }
}

export const getToken = () => {
    return dispatch => {
        var details = {
            grant_type: "client_credentials",
            client_id: "reactUI",
            client_secret: "7894381c-3a59-4742-a5d4-0becc59f8ed7"
        };
        
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return fetch((process.env.REACT_APP_KEYCLOAK_URL + "realms/GoldenBird/protocol/openid-connect/token"), {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then((result) => {
                Cookie.set("appToken", result);
                return dispatch(setTokenSuccess(result));
            })
            .catch((error) => {
                // console.log(error);
                return dispatch(setTokenFail("Somthing went wrong. Please reload the page."));
            })
    };
}