import React from 'react';
import PropTypes from 'prop-types';

import { Panel } from '../Panel';

import './style.scss';

const defaultSerialiser = (array) => array.map(i => <div key={i}>{i}</div>);
const formatValue = (key, value, metadata) => {
  const meta = metadata[key];
  if (!meta) {
    return value;
  }
  switch (meta.type) {
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'array':
      return (meta.serialiser || defaultSerialiser)(value);
    default:
      return value;
  }
};

export const DataPanel = ({ title, description, data, metadata = {} }) => {
  return (
    <Panel className="data-panel">
      <h2 className="data-panel__title">{title}</h2>
      <div className="data-panel__description">{description}</div>
      {
        Object.entries(data).map(([key, value]) => {
          return (
            <div className="data-panel__row" key={key}>
              <div className="data-panel__key">{key}</div>
              <div className="data-panel__value">{formatValue(key, value, metadata)}</div>
            </div>
          );
        })
      }
    </Panel>
  );
};

DataPanel.propTypes = {
  title: PropTypes.string,
  description: PropTypes.node,
  data: PropTypes.object,
  metadata: PropTypes.object,
};
