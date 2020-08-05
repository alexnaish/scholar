import React from 'react';
import PropTypes from 'prop-types';

import { GridContainer } from '../../../components/GridContainer';
import { InfoPanel } from '../../../components/InfoPanel';

export const SnapshotDetails = ({ version, approval_date }) => {
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
