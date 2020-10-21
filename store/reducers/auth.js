import * as actionTypes from './../types';

const initialState = {
    authenticated: false,
    userAuth: null,
    isLoading: false
}

const auth = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.SET_AUTH_LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            }

        case actionTypes.SET_AUTH:
            return {
                ...state,
                isLoading: false,
                authenticated: action.payload.authenticated,
                userAuth: action.payload.userAuth
            }

        default:
            return state
    }
}
export default auth
