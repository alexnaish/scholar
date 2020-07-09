import React from 'react';
import PropTypes from 'prop-types';

import { ExternalLink } from '../Button';

import './style';

export const Promo = ({ buttonStyle, children, imageElement, link = {} }) => {
  return (
    <div className="promo">
      <div className="promo__content">{children}</div>
      {link.href && <ExternalLink style={buttonStyle} href={link.href}>{link.text}</ExternalLink>}
      <div className="promo__image">{imageElement}</div>
    </div>
  );
};

Promo.propTypes = {
  buttonStyle: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  imageElement: PropTypes.node,
  link: PropTypes.shape({
    href: PropTypes.string,
    text: PropTypes.string
  })
};
