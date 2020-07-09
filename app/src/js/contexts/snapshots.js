import React, { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  snapshots: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { snapshots: [...state.snapshots, 'new snap!'] };
    case 'reset':
      return { snapshots: [] };
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
