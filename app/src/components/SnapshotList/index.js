import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'wouter';
import PropTypes from 'prop-types';

import { Loader } from '../Loader';
import { GridContainer } from '../GridContainer';
import { CallToAction } from '../Button';
import { SnapshotsContext } from '../../contexts/Snapshots';
import { update } from '../../contexts/Snapshots/actions';
import useFetch from '../../utils/fetch';

import './style.scss';

export const SnapshotList = ({ outstanding = {} }) => {
  const [nextCursor, setNextCursor] = useState(undefined);
  const [{ snapshots, cursor }, dispatch] = useContext(SnapshotsContext);
  const { response, error, loading } = useFetch({ path: `/snapshots${nextCursor ? `?cursor=${nextCursor}` : ''}` });

  useEffect(() => {
    if (response) {
      const newItems = nextCursor ? [...snapshots, ...response.data] : response.data;
      update(dispatch)({
        data: newItems,
        count: response.count,
        cursor: response.cursor
      });
    }
  }, [response]);

  return (
    <Fragment>
      {
        error && <div>There is an error</div>
      }
      {
        loading && <Loader />
      }
      <GridContainer>
        {
          snapshots.map(snapshot => {
            return <div key={snapshot.id} className="snapshot">
              <img className="snapshot__image" src={snapshot.image_url} alt={`${snapshot.id} image`} />
              <Link href={`/snapshot/${snapshot.id}`}><a className="snapshot__link">{snapshot.id}</a></Link>
              { outstanding[snapshot.id] && <div title="Has unapproved candidates" className="snapshot__marker">?</div> }
            </div>;
          })
        }
      </GridContainer>
      { cursor && <CallToAction centre onClick={() => setNextCursor(cursor)}>Load More</CallToAction> }
    </Fragment>

  );
};

SnapshotList.propTypes = {
  outstanding: PropTypes.object
};
