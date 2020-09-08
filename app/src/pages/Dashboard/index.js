import React, { useContext, useEffect } from 'react';

import { SnapshotsContext } from '../../contexts/Snapshots';
import { stats } from '../../contexts/Snapshots/actions';
import { Shell } from '../../components/Shell';
import { SnapshotList } from '../../components/SnapshotList';
import { Section } from '../../components/Section';
import { GridContainer } from '../../components/GridContainer';
import { InfoPanel } from '../../components/InfoPanel';
import { IllustratedCTA } from '../../components/IllustratedCTA';
import { Button, ExternalLink } from '../../components/Button';
import { DataIllustrationSvg } from '../../components/DataIllustrationSvg';

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
        {
          response && approved === 0 && candidates === 0 &&
            <IllustratedCTA
              text="You don&apos;t have any snapshots!"
              cta={<ExternalLink href="/docs/" centre>View Documentation</ExternalLink>}
              svg={<DataIllustrationSvg />}
            />
        }
      </Section>
    </Shell>
  );
};
