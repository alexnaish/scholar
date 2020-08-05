import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'wouter';
import classNames from 'classnames';

import './style.scss';

const createClasses = ({ centre, style, small, collapse }) =>
  classNames('button', {
    'button--central': centre,
    [`button--${style}`]: !!style,
    ['button--small']: small,
    ['button--collapse']: collapse
  });

export const Button = ({ centre, onClick, style = 'cta', small, collapse, children }) => {
  const className = createClasses({ centre, style, small, collapse  });
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export const InternalLink = ({ href, centre, style, collapse, small, children }) => {
  const className = createClasses({ centre, style, collapse, small });
  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  );
};

export const ExternalLink = ({ href, centre, style, children }) => {
  const className = createClasses({ centre, style });
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}</a >
  );
};

const baseProps = {
  href: PropTypes.string,
  style: PropTypes.string,
  centre: PropTypes.bool,
  small: PropTypes.bool,
  collapse: PropTypes.bool,
  children: PropTypes.node,
};

InternalLink.propTypes = baseProps;
ExternalLink.propTypes = baseProps;

Button.propTypes = {
  ...baseProps,
  onClick: PropTypes.func
};
