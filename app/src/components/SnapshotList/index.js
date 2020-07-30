import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Loader } from '../Loader';
import { CallToAction } from '../Button';
import { SnapshotsContext } from '../../contexts/Snapshots';
import { update } from '../../contexts/Snapshots/actions';
import useFetch from '../../utils/fetch';

import './style.scss';
const baseApiPath = '/snapshots';

export const SnapshotList = () => {
  const [apiPath, setApiPath] = useState(baseApiPath);
  const [{ snapshots, count, cursor }, dispatch] = useContext(SnapshotsContext);
  const { response, error, loading } = useFetch({ path: apiPath });

  useEffect(() => {
    if (response) {
      update(dispatch)(response);
    }
  }, [response]);

  return (
    <Fragment>
      <h1>Snapshots: ({count})</h1>
      {
        error && <div>There is an error</div>
      }
      {
        loading && <Loader />
      }
      <div className="snapshots-list">
        {
          snapshots.map(snapshot => {
            return <div key={snapshot.id} className="snapshots-list__item">{snapshot.id}</div>;
          })
        }
      </div>
      { cursor && <CallToAction centre onClick={() => setApiPath(`${baseApiPath}?cursor=${cursor}`)}>LoadMore</CallToAction> }
    </Fragment>

  );
};
