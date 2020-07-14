import React, { useContext, Fragment } from 'react';
import { Link } from 'wouter';
import { AuthContext } from '../../contexts/Auth';

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

export const Navigation = () => {
  const [{ accessToken }] = useContext(AuthContext);

  return (
    <nav className="nav">
      {
        accessToken
          ? <LoggedInLinks />
          : <Link href="/login"><a className="nav__link">Login</a></Link>
      }
    </nav>
  );
};
