import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    userId: null,
    token: null,
    loading: false,
    error: false,
    authRedirectPath: '/'
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.ACCOUNT_AUTHENTICATE_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.ACCOUNT_AUTHENTICATE_SUCESS:
            return updateObject(state, {
                loading: false,
                userId: action.userId,
                token: action.token,
                error: null
            })

        case actionTypes.ACCOUNT_AUTHENTICATE_FAIL:
            return updateObject(state, {
                loading: false,
                error: action.error
            })
        case actionTypes.AUTH_LOGOUT:
            return updateObject(state, {
                token: null,
                userId: null
            })
        case actionTypes.SET_AUTH_REDIRECT_PATH:
            return updateObject(state, {
                authRedirectPath: action.path
            })
        default:
            return {
                ...state
            }
    }
}

export default reducer;

