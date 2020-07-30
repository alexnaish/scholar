import { TYPES, STORAGE_KEY } from './config';

export const storeSession = (payload) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const retrieveStoredSession = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
};

export const clearSession = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};

export const login = (dispatch) => (payload) => {
  return dispatch({
    type: TYPES.LOGIN,
    payload
  });
};

export const refresh = (dispatch) => (payload) => {
  return dispatch({
    type: TYPES.REFRESH,
    payload
  });
};

export const logout = (dispatch) => () => {
  return dispatch({
    type: TYPES.LOGOUT
  });
};
