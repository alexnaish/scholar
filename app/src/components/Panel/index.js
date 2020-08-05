import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

export const Panel = ({ className, children }) => {
  const classes = classNames('panel', { [className]: !!className });
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

Panel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired
};
