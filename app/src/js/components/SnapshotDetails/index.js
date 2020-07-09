import React, { useContext } from 'react';
import { SnapshotsContext } from '../../contexts/snapshots';

export const SnapshotDetails = () => {
  const [{ snapshots }, dispatch] = useContext(SnapshotsContext);
  return (
    <div>
      <h1>Snapshots: ({snapshots.length})</h1>
      <button onClick={() => dispatch({ type: 'increment' })}>Add New</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
};
