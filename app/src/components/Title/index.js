import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const Title = ({ children }) => {
  return (
    <div className="title">
      {children}
    </div>
  );
};

Title.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
