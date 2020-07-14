import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

export const Alert = ({ type, title, message, dismissable = true }) => {
  const className = classNames('alert', { [`alert--${type}`]: type });
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className={className} role="alert">
      <div className="alert__title">{title}</div>
      <div className="alert__message">{message}</div>
      { dismissable && <button onClick={() => setDismissed(true)} className="alert__dismiss" aria-label="dismiss alert">&#x2715;</button>}
    </div>
  );
};

const baseProps = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  dismissable: PropTypes.bool
};

Alert.propTypes = {
  type: PropTypes.string.isRequired,
  ...baseProps
};
