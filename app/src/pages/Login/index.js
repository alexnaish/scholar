import React, { useContext, useEffect, useState } from 'react';
const { parse } = require('query-string');

import { Shell } from '../../components/Shell';
import { Signin } from '../../components/Signin';
import { AuthContext } from '../../contexts/Auth';
import { useLocation } from 'wouter';

export const LoginPage = () => {
  const [state] = useContext(AuthContext);
  const [error, setError] = useState(null);
  const setLocation = useLocation()[1];

  useEffect(() => {
    if (state.accessToken) {
      return setLocation('/dashboard');
    }

    const queryParams = parse(window.location.search);
    if (queryParams.errorCode) {
      const message = queryParams.errorCode === 'fulfilled'
        ? 'Your authentication attempt was already fulfilled. Please clear your browser cookies and retry.'
        : 'An unknown error occured when attempting to link accounts.';
      setError(message);
    }

  }, []);

  return (
    <Shell>
      <Signin error={error} />
    </Shell>
  );
};
