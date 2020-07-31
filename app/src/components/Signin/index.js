import React, { useEffect, useContext } from 'react';
import { useLocation } from 'wouter';
import PropTypes from 'prop-types';

import { Section } from '../Section';
import { Alert } from '../Alert';

import './style.scss';
import { AuthContext } from '../../contexts/Auth';
import { storeSession, login } from '../../contexts/Auth/actions';

const triggerOverlay = (provider) => {
  window.open(
    `${process.env.API_URL}/auth/${provider}`,
    null,
    'height=600,width=400,status=yes,toolbar=no,menubar=no,location=no'
  );
};

export const Signin = ({ error }) => {
  const dispatch = useContext(AuthContext)[1];
  const setLocation = useLocation()[1];

  useEffect(() => {
    const listener = ({ data }) => {
      if (data.errorCode) {
        return setLocation(`/login?errorCode=${data.errorCode}`, true);
      }

      if (data.accessToken) {
        storeSession(data);
        login(dispatch)(data);
        setLocation('/dashboard');
      }

    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, []);

  return (
    <Section title="Sign In">
      { error && <Alert type="error" title="Unable to sign in." message={error} />}
      <button className="signin-button signin-button--google" onClick={() => triggerOverlay('google')}>Log in with Google</button>
      <button className="signin-button signin-button--github" onClick={() => triggerOverlay('github')}>Log in with GitHub</button>
    </Section>
  );
};

Signin.propTypes = {
  error: PropTypes.string
};
