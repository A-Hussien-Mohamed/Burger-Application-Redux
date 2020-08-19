import * as actionTypes from './actionTypes';
import axios from 'axios';

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const signup = (authData) => {
    return dispatch => {
        dispatch(authenticateStart);
        authData.returnSecureToken = true;
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDRUWNqqOSedwwgfFhlFRaFD_ckPoINV7E', authData)
            .then(response => {
                dispatch(authenticateSucess(response.data.token, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            }).catch(function (error) {
                dispatch(authenticatFail(error))
            })
    }
}


export const authenticateStart = () => {
    return {
        type: actionTypes.ACCOUNT_AUTHENTICATE_START
    }
}

export const authenticateSucess = (token, userId) => {

    return {
        type: actionTypes.ACCOUNT_AUTHENTICATE_SUCESS,
        token: token,
        userId: userId
    }
}

export const authenticatFail = (error) => {
    return {
        type: actionTypes.ACCOUNT_AUTHENTICATE_FAIL,
        error: error
    }
}

export const signIn = (authData) => {
    authData.returnSecureToken = true;
    return dispatch => {
        dispatch(authenticateStart());
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDRUWNqqOSedwwgfFhlFRaFD_ckPoINV7E', authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authenticateSucess(response.data.idToken, response.data.localId));
                // dispatch(checkAuthTimeout(response.data.expiresIn));
            }).catch(error => {
                dispatch(authenticatFail(error));
            })
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        }
        else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate < new Date()) {
                dispatch(logout());
            }
            else {
                const userId = localStorage.getItem('userId');
                dispatch(authenticateSucess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));

            }
        }

    }
}

