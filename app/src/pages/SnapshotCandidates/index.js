import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'wouter';

import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { Alert } from '../../components/Alert';
import { Loader } from '../../components/Loader';
import { ActionBar } from '../../components/ActionBar';
import { Button } from '../../components/Button';
import { DataPanel } from '../../components/DataPanel';
import { OffscreenSection } from '../../components/OffscreenSection';
import { Title } from '../../components/Title';
import useFetch from '../../utils/fetch';

import './style.scss';

export const SnapshotCandidatesPage = ({ params }) => {
  const setLocation = useLocation()[1];
  const [candidate, setCandidate] = useState({});
  const { response, error, loading } = useFetch({ path: `/snapshots/${params.id}/candidates` });
  const mainImage = response && response.main || { dimensions: { width: '100%' } };
  const divisorRef = useRef(null);
  const diffRef = useRef(null);

  const handleChange = (value) => divisorRef.current.style.clipPath = `inset(0 ${100-value}% 0 0)`;
  const toggleDiff = () => {
    const display = diffRef.current.style.display;
    diffRef.current.style.display = display === 'none' ? '' : 'none';
  };

  return (
    <Shell>
      <Section>
        <ActionBar>
          <Button style="dark" onClick={() => setLocation(`/snapshot/${params.id}`)} collapse small>Back</Button>
        </ActionBar>
        { error && <Alert type="error" title="Error" message="Unable to retrieve candidates." />}
        { loading && <Loader /> }
        { response && response.data && response.data.map((item, index) => {
          return (
            <DataPanel
              key={item.id}
              title={`Candidate ${index + 1}`}
              data={{ creation_date: item.creation_date, view: <Button small collapse onClick={() => setCandidate(item)}>View</Button> }}
              metadata={{ creation_date: { type: 'datetime' } }}
            />
          );
        })}
      </Section>
      <OffscreenSection
        display={!!candidate.id}
        size="100%"
        onClose={() => setCandidate({})}>
        <Title>
					Comparison ({new Date(candidate.creation_date).toLocaleString()})
        </Title>
        <ActionBar>
          <Button style="success" collapse small>Approve</Button>
          <Button style="blue" collapse small onClick={toggleDiff}>Toggle Diff</Button>
          <Button style="danger" collapse small>Delete</Button>
        </ActionBar>
        <div className="comparison" style={{ maxWidth: mainImage.dimensions.width, maxHeight: mainImage.dimensions.height }}>
          <img className="comparison__image" src={candidate.image_url} />
          <span className="comparison__label comparison__label--right">Candidate</span>
          <div className="comparison__overlay" style={{ clipPath: 'inset(0 50% 0 0)' }} ref={divisorRef}>
            <img className="comparison__image" src={mainImage.image_url} />
            <span className="comparison__label">Main</span>
          </div>
          <input className="comparison__range" type="range" min="0" max="100" id="slider" onInput={(e) => handleChange(e.target.value)} />
          <div className="comparison__overlay" ref={diffRef} style={{ display: 'none' }}>
            <img className="comparison__image" src={candidate.diff_image_url} />
            <span className="comparison__label">Diff</span>
          </div>
        </div>
      </OffscreenSection>
    </Shell>
  );
};

SnapshotCandidatesPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};
