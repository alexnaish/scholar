import React, { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

import { TYPES } from './config';
import { retrieveStoredSession } from './actions';

const initialState = retrieveStoredSession();

function reducer(state, action) {
  switch (action.type) {
    case TYPES.LOGIN:
      return {
        ...state,
        ...action.payload
      };
    case TYPES.REFRESH:
      return {
        ...state,
        accessToken: action.payload
      };
    case TYPES.LOGOUT:
      return {};
    default:
      throw new Error(`Unknown action.type: ${action.type}`);
  }
}

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const reducerDetails = useReducer(reducer, initialState);
  return (
    <AuthContext.Provider value={reducerDetails}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
