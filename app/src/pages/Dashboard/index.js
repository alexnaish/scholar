import React from 'react';

import { SnapshotsProvider } from '../../contexts/snapshots';
import { SnapshotDetails } from '../../components/SnapshotDetails';
import { Shell } from '../../components/Shell';

export const DashboardPage = () => {
  return (
    <Shell>
      <SnapshotsProvider>
        Dashboard Here
        <SnapshotDetails />
      </SnapshotsProvider>
    </Shell>
  );
};
