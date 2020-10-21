import * as actionTypes from './../types';

const initialState = {
    errorMessage: null,
     token  : null,
    loading: true
}

const appToken = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.GET_TOKEN_LOADING:
            return {
                ...state,
                errorMessage: null,
                loading: true
            }

        case actionTypes.GET_TOKEN_SUCCESS:
            return {
                errorMessage: null,
                token: action.payload.token,
                loading: false
            }

        case actionTypes.GET_TOKEN_FAIL:
            return {
                errorMessage: action.payload.errorMessage,
                token: null,
                loading: false
            }

        default:
            return state
    }
}
export default appToken;
