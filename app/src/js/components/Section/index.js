import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './style.scss';

export const Section = ({ title, style, children }) => {
  return (
    <div className={classNames('section', { [`section--${style}`]: !!style })}>
      {title && <div className="section__title">{title}</div>}
      <div className="section__content">{children}</div>
    </div>
  );
};

Section.propTypes = {
  title: PropTypes.string,
  style: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
