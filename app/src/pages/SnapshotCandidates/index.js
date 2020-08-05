import React from 'react';
import PropTypes from 'prop-types';

import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { Icon } from '../../components/Icon';
import { Title } from '../../components/Title';
import { ActionBar } from '../../components/ActionBar';

export const SnapshotCandidatesPage = ({ params }) => {

  return (
    <Shell>
      <Section>
        <Title>
          <Icon name="compare" /> {`Candidates: ${params.id}`}
        </Title>
        <ActionBar>Hi</ActionBar>
      </Section>
    </Shell>
  );
};

SnapshotCandidatesPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};
