import React from 'react';
import PropTypes from 'prop-types';

import { Centre } from '../Centre';
import { Panel } from '../Panel';
import { Paragraph } from '../Paragraph';

export const IllustratedCTA = ({ text, cta, svg }) => {
  return (
    <Centre>
      <Panel>
        <Paragraph>
          {text}
          {cta}
        </Paragraph>
        {svg}
      </Panel>
    </Centre>
  );
};

IllustratedCTA.propTypes = {
  text: PropTypes.node.isRequired,
  cta: PropTypes.node.isRequired,
  svg: PropTypes.node.isRequired
};
