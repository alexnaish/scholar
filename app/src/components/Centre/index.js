import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const Centre = ({ children }) => {
  return (
    <div className="centre">{children}</div>
  );
};

Centre.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired
};
