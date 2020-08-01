import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const GridContainer = ({ children, rowGap, colGap }) => {
  return (
    <div className="grid-container" style={{
      '--grid-row-gap': rowGap && `${rowGap}px`,
      '--grid-col-gap': colGap && `${colGap}px`
    }}>
      {
        children
      }
    </div>
  );
};

GridContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  colGap: PropTypes.number,
  rowGap: PropTypes.number
};
