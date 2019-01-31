import { GET_ERRORS } from './types';
import axios from 'axios';

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
