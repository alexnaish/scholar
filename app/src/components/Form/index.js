import React from 'react';
import PropTypes from 'prop-types';

export const Form = ({ children }) => {
  return <form>{children}</form>;
};

Form.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired
};
