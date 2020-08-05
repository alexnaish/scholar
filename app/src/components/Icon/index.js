import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const Icon = ({ name, style = 'color', size = 50 }) => {
  return (
    <img className="icon" src={`https://img.icons8.com/${style}/${size}/000000/${name}.png`} alt={`${name} icon`} role="presentational" />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.string,
  size: PropTypes.number,
};
