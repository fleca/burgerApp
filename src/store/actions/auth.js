import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idToken,
    userId: userId
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    authData: error
  };
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    const signUpUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAzq2JQPud5k5XiqCFrN7XTT73NO0qUVL4';
    const signInUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAzq2JQPud5k5XiqCFrN7XTT73NO0qUVL4';
    const url = isSignup ? signUpUrl : signInUrl;

    axios.post(url, authData)
      .then(resp => {
        console.log(resp);
        dispatch(authSuccess(resp.data.idToken, resp.data.localId));
      })
      .catch(err => {
        console.log(err);
        dispatch(authFail(err));
      })
  };
};