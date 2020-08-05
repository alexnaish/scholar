import React from 'react';
import PropTypes from 'prop-types';

import { Panel } from '../Panel';

import './style.scss';

export const ActionBar = ({ children }) => {

  return (
    <Panel className="action-bar">
      {children}
    </Panel>
  );
};

ActionBar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired
};
