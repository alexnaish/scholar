import React, { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  snapshots: ['blah'],
};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { snapshots: [...state.snapshots, `new snap! ${Math.random()}`] };
    case 'reset':
      return initialState;
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
