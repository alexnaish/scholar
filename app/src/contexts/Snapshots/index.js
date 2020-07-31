import React, { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

import { TYPES } from './config';

const initialState = {
  snapshots: [],
  cursor: undefined,
  approved: 0,
  candidates: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case TYPES.UPDATE: {
      return {
        ...state,
        count: state.count + action.payload.count,
        snapshots: action.payload.data,
        cursor: action.payload.cursor
      };
    }
    case TYPES.COUNT:
      return {
        ...state,
        approved: action.payload.approved,
        candidates: action.payload.candidates,
      };
    default:
      throw new Error(`Unknown action.type: ${action.type}`);
  }
}

export const SnapshotsContext = createContext([]);

export const SnapshotsProvider = ({ children }) => {
  const reducerDetails = useReducer(reducer, initialState);
  return (
    <SnapshotsContext.Provider value={reducerDetails}>
      {children}
    </SnapshotsContext.Provider>
  );
};

SnapshotsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
