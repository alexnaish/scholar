import React from 'react';
import { Link } from 'wouter';

import useFetch from '../../utils/fetch';
import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { Alert } from '../../components/Alert';
import { Loader } from '../../components/Loader';
import { GridContainer } from '../../components/GridContainer';
import { DataPanel } from '../../components/DataPanel';
import { IllustratedCTA } from '../../components/IllustratedCTA';
import { Button } from '../../components/Button';
import { TeamIllustrationSvg } from '../../components/TeamIllustrationSvg';

const personalDescription = <span>
	We do not store more information than is required. <Link href="/privacy">See our privacy policy.</Link>
</span>;
const personalMetadata = {
  created: { type: 'date' }
};

export const ProfilePage = () => {
  const { response, error, loading } = useFetch({ path: '/profile' });
  return (
    <Shell>
      <Section title="Profile">
        { error && <Alert type="error" title="Error" message="Unable to retrieve profile details" />}
        { loading && <Loader /> }
        {
          response && (
            <GridContainer>
              <DataPanel
                title="Personal"
                description={personalDescription}
                data={response.user}
                metadata={personalMetadata}
              />
              <DataPanel
                title="Team Info"
                description="Information on your team here."
                data={response.team }
                metadata={{ users: { type: 'array' } }}
              />
            </GridContainer>
          )
        }
        <IllustratedCTA
          text="Everything is better with company. Invite your team."
          cta={<Button centre onClick={() => alert('Coming soon!')}>Invite</Button>}
          svg={<TeamIllustrationSvg />}
        />
      </Section>
    </Shell>
  );
};
