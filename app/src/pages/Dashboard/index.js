import React, { useContext, useEffect } from 'react';

import { SnapshotsContext } from '../../contexts/Snapshots';
import { count } from '../../contexts/Snapshots/actions';
import { Shell } from '../../components/Shell';
import { SnapshotList } from '../../components/SnapshotList';
import { Section } from '../../components/Section';
import { InfoPanel } from '../../components/InfoPanel';

import useFetch from '../../utils/fetch';

export const DashboardPage = () => {
  const [{ approved, candidates }, dispatch] = useContext(SnapshotsContext);
  const { response } = useFetch({ path: '/stats' });

  useEffect(() => {
    if (response) {
      count(dispatch)(response);
    }
  }, [response]);
  return (
    <Shell>
      <Section title="Dashboard">
        <InfoPanel icon="approval" title="Total" value={approved}/>
        <InfoPanel icon="question-mark" title="Unapproved" value={candidates} />
        <SnapshotList />
      </Section>
    </Shell>
  );
};
