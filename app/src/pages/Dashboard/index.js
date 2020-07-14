import React from 'react';

import { SnapshotsProvider } from '../../contexts/Snapshots';
import { Shell } from '../../components/Shell';
import { SnapshotList } from '../../components/SnapshotList';
import { Section } from '../../components/Section';

export const DashboardPage = () => {
  return (
    <Shell>
      <SnapshotsProvider>
        <Section title="Dashboard">
          <SnapshotList />
        </Section>
      </SnapshotsProvider>
    </Shell>
  );
};
