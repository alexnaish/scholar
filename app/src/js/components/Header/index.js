import React from 'react';
import { Link } from 'wouter';
import { Navigation } from '../Navigation';

import './style.scss';

export const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <Link href="/">
          <a className="header__name">Scholar</a>
        </Link>
        <Navigation />
      </div>
    </header>
  );
};
