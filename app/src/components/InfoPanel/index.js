import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const InfoPanel = ({ icon, title, value }) => {
  return (
    <div className="info-panel">
      { icon && <img src={`https://img.icons8.com/bubbles/50/000000/${icon}.png`} className="info-panel__icon" role="presentational" /> }
      <div>
        <div className="info-panel__title">{title}</div>
        <div className="info-panel__value">{value}</div>
      </div>
    </div>
  );
};

InfoPanel.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])
};
