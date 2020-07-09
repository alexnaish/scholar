import React, { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

import { TYPES } from './actions';

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case TYPES.LOGIN:
      return {
        ...state,
        user: { id: 'blah', first_name: 'something' },
      };
    case TYPES.LOGOUT:
      return null;
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
