import React, { useContext } from 'react';
import { Link } from 'wouter';
import { AuthContext } from '../../contexts/Auth';

export const Navigation = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav>
      {
        user ? <Link href="/dashboard"><a>Dashboard</a></Link> : <Link href="/login"><a>Login</a></Link>
      }
    </nav>
  );
};
