import axios from 'axios';
import setAuthToken from '../utils/setkAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// REGISTER
export const registerUser = (userData, history) => dispatch => {
  // MAKE SUBMIT
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// LOGIN / GET USER TOKEN
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // GRAB TOKEN
      const { token } = res.data;

      // SET TOKEN TO LOCAL STORAGE
      localStorage.setItem('jwtToken', token);

      // SET TOKEN TO AUTH HEADER
      setAuthToken(token);

      // DECODE TOKEN & GET USER
      const decoded = jwt_decode(token);

      // SET CURRENT USER
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// SET LOGGED IN USER
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
