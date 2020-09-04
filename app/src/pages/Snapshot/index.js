import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import timeDistance from 'date-fns/formatDistanceToNow';
import { useLocation } from 'wouter';

import { Shell } from '../../components/Shell';
import { Loader } from '../../components/Loader';
import { Section } from '../../components/Section';
import { Paragraph } from '../../components/Paragraph';
import { ActionBar } from '../../components/ActionBar';
import { OffscreenSection } from '../../components/OffscreenSection';
import { Snapshot } from '../../components/Snapshot';
import { Button, InternalLink } from '../../components/Button';
import { IllustratedCTA } from '../../components/IllustratedCTA';
import { CompareIllustrationSvg } from '../../components/CompareIllustrationSvg';
import useFetch from '../../utils/fetch';

import { SnapshotDetails } from './components/SnapshotDetails';
import { HistorySection } from './components/HistorySection';

import './style.scss';

export const SnapshotPage = ({ params }) => {
  const setLocation = useLocation()[1];
  const [selectedImage, setSelectedImage] = useState(null);
  const { response = { history: [], candidates: [] }, error, loading } = useFetch({ path: `/snapshots/${params.id}` });

  return (
    <Shell>
      <Section title={`Snapshot: ${params.id}`}>
        { error && <div>{error}</div>}
        {
          loading ? <Loader /> : (
            <Fragment>
              <SnapshotDetails {...response.main} />
              <ActionBar>
                <Button style="blue" onClick={() => setSelectedImage(response.main)} collapse small>View Approved Image</Button>
                { response.candidates.length > 0 && <InternalLink href={`/snapshot/${params.id}/candidates`} style="cta" collapse small>View Candidates</InternalLink> }
                <Button style="dark" onClick={() => setLocation('/dashboard')} collapse small>Back</Button>
              </ActionBar>
              {
                response.history.length > 0 && <HistorySection history={response.history} onItemClick={setSelectedImage} />
              }
            </Fragment>
          )
        }
        {
          !loading && response.history.length === 0 && <IllustratedCTA
            text="You&apos;ve made history - this is the first version!"
            svg={<CompareIllustrationSvg />}
          />
        }
      </Section>
      <OffscreenSection
        display={!!selectedImage}
        size="60%"
        minSize="320px"
        onClose={() => setSelectedImage(null)}
      >
        {
          selectedImage ? (
            <Section title={`Version ${selectedImage.version}`}>
              <Paragraph title={new Date(selectedImage.approval_date).toLocaleDateString()}>Approved {timeDistance(selectedImage.approval_date)} ago</Paragraph>
              <Snapshot id={selectedImage.id} image_url={selectedImage.image_url} />
            </Section>
          ) : ''
        }

      </OffscreenSection>
    </Shell>
  );
};

SnapshotPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};
