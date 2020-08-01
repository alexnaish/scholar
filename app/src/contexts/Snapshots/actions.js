import { TYPES } from './config';

export const update = (dispatch) => (payload) => {
  return dispatch({
    type: TYPES.UPDATE,
    payload
  });
};

export const stats = (dispatch) => (payload) => {
  return dispatch({
    type: TYPES.STATS,
    payload
  });
};
