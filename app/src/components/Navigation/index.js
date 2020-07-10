import React, { useContext } from 'react';
import { Link } from 'wouter';
import { AuthContext } from '../../contexts/Auth';

import './style.scss';

export const Navigation = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="nav">
      {
        user
          ? <Link href="/dashboard"><a className="nav__link">Dashboard</a></Link>
          : <Link href="/login"><a className="nav__link">Login</a></Link>
      }
    </nav>
  );
};
