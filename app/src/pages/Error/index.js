import React from 'react';
import PropTypes from 'prop-types';

import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { InternalLink } from '../../components/Button';
import { Paragraph } from '../../components/Paragraph';

const errorMessage = (statusCode) => {
  switch (statusCode) {
    case '404':
      return 'Missing Page';
    case '500':
    default:
      return 'Unknown Error';
  }
};

export const ErrorPage = ({ statusCode }) => {
  const errorTitle = errorMessage(statusCode);
  return (
    <Shell>
      <Section title={errorTitle}>
        <Paragraph>
				For some reason, you ran into this error. Sorry about that!
        </Paragraph>
				We&apos;ve made a note but if you think this is an issue, please let us know!
        <InternalLink href="/dashboard">Return to dashboard</InternalLink>
      </Section>
    </Shell>
  );
};

ErrorPage.propTypes = {
  statusCode: PropTypes.string
};
