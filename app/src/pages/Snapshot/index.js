import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import timeDistance from 'date-fns/formatDistanceToNow';

import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { Loader } from '../../components/Loader';
import { GridContainer } from '../../components/GridContainer';
import { InfoPanel } from '../../components/InfoPanel';
import { OffscreenSection } from '../../components/OffscreenSection';
import useFetch from '../../utils/fetch';

const SnapshotDetails = ({ version, approval_date }) => {
  return (
    <GridContainer>
      <InfoPanel icon="versions" title="Version" value={version} />
      <InfoPanel icon="calendar" title="Approved" value={new Date(approval_date).toLocaleDateString()} />
    </GridContainer>
  );
};

SnapshotDetails.propTypes = {
  version: PropTypes.number,
  approval_date: PropTypes.number
};

export const SnapshotPage = ({ params }) => {
  const [showOverlay, setShowOverlay] = useState(null);
  const { response, error, loading } = useFetch({ path: `/snapshots/${params.id}` });

  return (
    <Shell>
      <Section title={`Snapshot: ${params.id}`}>
        { error && <div>{error}</div>}
        {
          loading ? <Loader /> : (
            <Fragment>
              <SnapshotDetails {...response.main} />
              <div>
								History
                {
                  response.history.map(history => {
                    return (
                      <div key={history.id}>
                        <div>{history.version}</div>
                        <div>Approved {timeDistance(history.approval_date)} ago</div>
                        <button className="button" onClick={() => setShowOverlay(true)}>View Image</button>
                      </div>
                    );
                  })
                }
              </div>
            </Fragment>
          )
        }
      </Section>
      <OffscreenSection
        display={showOverlay}
        size="50%"
        minSize="320px"
        onClose={() => setShowOverlay(false)}
      >
				hello
      </OffscreenSection>
    </Shell>
  );
};

SnapshotPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};
