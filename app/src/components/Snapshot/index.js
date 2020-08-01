import React from 'react';
import { Link } from 'wouter';
import PropTypes from 'prop-types';

import './style.scss';

export const Snapshot = ({ id, image_url, link, marker }) => {
  return (
    <div className="snapshot">
      <img className="snapshot__image" src={image_url} alt={`${id} image`} />
      { link && <Link href={`/snapshot/${id}`}><a className="snapshot__link">{id}</a></Link> }
      { marker && <div title="Has unapproved candidates" className="snapshot__marker">?</div> }
    </div>
  );
};

Snapshot.propTypes = {
  id: PropTypes.string,
  image_url: PropTypes.string,
  link: PropTypes.bool,
  marker: PropTypes.bool,
};
