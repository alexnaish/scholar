import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'wouter';

import './style.scss';

const LoggedInLinks = () => {
  return (
    <Fragment>
      <Link href="/dashboard"><a className="nav__link">Dashboard</a></Link>
      <Link href="/profile"><a className="nav__link">Profile</a></Link>
      <Link href="/logout"><a className="nav__link">Sign out</a></Link>
    </Fragment>
  );
};

export const Navigation = ({ authorised }) => {

  return (
    <nav className="nav">
      {
        authorised
          ? <LoggedInLinks />
          : <Link href="/login"><a className="nav__link">Login</a></Link>
      }
    </nav>
  );
};

Navigation.propTypes = {
  authorised: PropTypes.bool
};
