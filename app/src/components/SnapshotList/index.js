import React, { Fragment, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Loader } from '../Loader';
import { GridContainer } from '../GridContainer';
import { Button } from '../Button';
import { Snapshot } from '../Snapshot';
import { SnapshotsContext } from '../../contexts/Snapshots';
import { update } from '../../contexts/Snapshots/actions';
import useFetch from '../../utils/fetch';

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
        loading && !snapshots && <Loader />
      }
      <GridContainer>
        {
          snapshots.map(({ id, image_url }) => {
            return <Snapshot key={id} id={id} image_url={image_url} link marker={!!outstanding[id]} />;
          })
        }
      </GridContainer>
      { cursor && <Button centre onClick={() => setNextCursor(cursor)}>Load More</Button> }
    </Fragment>

  );
};

SnapshotList.propTypes = {
  outstanding: PropTypes.object
};
