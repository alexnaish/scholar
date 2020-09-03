import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'wouter';

import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { Alert } from '../../components/Alert';
import { Loader } from '../../components/Loader';
import { ActionBar } from '../../components/ActionBar';
import { Button } from '../../components/Button';
import { Panel } from '../../components/Panel';
import { OffscreenSection } from '../../components/OffscreenSection';
import useFetch from '../../utils/fetch';

export const SnapshotCandidatesPage = ({ params }) => {
  const setLocation = useLocation()[1];
  const [candidate, setCandidate] = useState(null);
  const { response, error, loading } = useFetch({ path: `/snapshots/${params.id}/candidates` });

  return (
    <Shell>
      <Section>
        <ActionBar>
          <Button onClick={() => setLocation(`/snapshot/${params.id}`)} collapse small>Back</Button>
        </ActionBar>
        { error && <Alert type="error" title="Error" message="Unable to retrieve candidates." />}
        { loading && <Loader /> }
        { response && response.data && response.data.map(item => {
          return (
            <Panel key={item.id} className='item-listing'>
              <div className="item-listing__emphasis">Created: { new Date(item.creation_date).toLocaleString()}</div>
              <button className="button button--collapse" onClick={() => setCandidate(item)}>View Image</button>
            </Panel>
          );
        })}
      </Section>
      <OffscreenSection
        display={!!candidate}
        size="90%"
        position="bottom"
        onClose={() => setCandidate(null)}>
        <h1>Hello#</h1>
      </OffscreenSection>
    </Shell>
  );
};

SnapshotCandidatesPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};
