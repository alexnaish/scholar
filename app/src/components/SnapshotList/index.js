import React, { Fragment, useContext } from 'react';
import { SnapshotsContext } from '../../contexts/Snapshots';

import './style.scss';

export const SnapshotList = () => {
  const [{ snapshots }, dispatch] = useContext(SnapshotsContext);
  return (
    <Fragment>
      <h1>Snapshots: ({snapshots.length})</h1>
      <button onClick={() => dispatch({ type: 'increment' })}>Add New</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <div className="snapshots-list">
        {
          snapshots.map(snapshot => {
            return <div key={snapshot} className="snapshots-list__item">{snapshot}</div>;
          })
        }
      </div>
    </Fragment>

  );
};
