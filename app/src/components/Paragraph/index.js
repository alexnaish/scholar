import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const Paragraph = ({ children }) => {
  return (
    <p className='paragraph'>{children}</p>
  );
};

Paragraph.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
