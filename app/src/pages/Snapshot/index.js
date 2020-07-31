import React from 'react';
import PropTypes from 'prop-types';

import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { Loader } from '../../components/Loader';
import useFetch from '../../utils/fetch';

export const SnapshotPage = ({ params }) => {
  const { response, error, loading } = useFetch({ path: `/snapshots/${params.id}` });

  return (
    <Shell>
      <Section title="Snapshot">
        { error && <div>{error}</div>}
        {
          loading && !response ? <Loader /> : <div>{JSON.stringify(response)}</div>
        }
      </Section>
    </Shell>
  );
};

SnapshotPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};
