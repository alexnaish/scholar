import React, { Fragment, useContext } from 'react';
import { Link } from 'wouter';
import { AuthContext } from '../../contexts/Auth';
import { Navigation } from '../Navigation';

import './style.scss';

export const Header = () => {
  const [{ accessToken }] = useContext(AuthContext);
  const authorised = !!accessToken;

  return (
    <Fragment>
      <a className="skip-link" href="#navigation">Skip to Navigation</a>
      <a className="skip-link" href="#site-content">Skip to Content</a>
      <a className="skip-link" href="#footer">Skip to Footer</a>
      <header className="header">
        <div className="header__container">
          <Link href={authorised ? '/dashboard' : '/'}>
            <a className="header__name">Scholar</a>
          </Link>
          <Navigation authorised={authorised} />
        </div>
      </header>
    </Fragment>
  );
};
