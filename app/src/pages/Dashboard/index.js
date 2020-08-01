import React, { useContext, useEffect } from 'react';

import { SnapshotsContext } from '../../contexts/Snapshots';
import { stats } from '../../contexts/Snapshots/actions';
import { Shell } from '../../components/Shell';
import { SnapshotList } from '../../components/SnapshotList';
import { Section } from '../../components/Section';
import { GridContainer } from '../../components/GridContainer';
import { InfoPanel } from '../../components/InfoPanel';

import useFetch from '../../utils/fetch';

export const DashboardPage = () => {
  const [{ approved, candidates, outstanding }, dispatch] = useContext(SnapshotsContext);
  const { response } = useFetch({ path: '/stats' });

  useEffect(() => {
    if (response) {
      stats(dispatch)(response);
    }
  }, [response]);

  return (
    <Shell>
      <Section title="Dashboard">
        <GridContainer rowGap={0}>
          <InfoPanel icon="approval" title="Total" value={approved}/>
          <InfoPanel icon="question-mark" title="Unapproved" value={candidates} />
        </GridContainer>
        <SnapshotList outstanding={outstanding} />
      </Section>
    </Shell>
  );
};
