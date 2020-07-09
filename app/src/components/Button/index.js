import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'wouter';
import classNames from 'classnames';

import './style.scss';

const createClasses = ({ centre, style }) => classNames('button', { 'button--central': centre, [`button--${style}`]: !!style });

export const CallToAction = ({ centre, onClick, children }) => {
  const className = createClasses({ centre, style: 'cta' });
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export const InternalLink = ({ href, centre, style, children }) => {
  const className = createClasses({ centre, style });
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

const LinkProps = {
  href: PropTypes.string,
  style: PropTypes.string,
  centre: PropTypes.bool,
  children: PropTypes.node,
};

InternalLink.propTypes = LinkProps;
ExternalLink.propTypes = LinkProps;

CallToAction.propTypes = {
  centre: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};
