import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '../Icon';
import { Panel } from '../Panel';

import './style.scss';

export const InfoPanel = ({ icon, title, value }) => {
  return (
    <Panel className="info-panel">
      { icon && <div className="info-panel__icon"><Icon name={icon} /></div> }
      <div>
        <div className="info-panel__title">{title}</div>
        <div className="info-panel__value">{value}</div>
      </div>
    </Panel>
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