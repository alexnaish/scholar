import React, { useContext, useEffect } from 'react';

import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { InternalLink } from '../../components/Button';
import { AuthContext } from '../../contexts/Auth';
import { logout, clearSession } from '../../contexts/Auth/actions';

export const LogoutPage = () => {
  const dispatch = useContext(AuthContext)[1];

  useEffect(() => {
    logout(dispatch)();
    clearSession();
  }, []);

  return (
    <Shell>
      <Section title='Signed Out'>
				You have been successfully signed out.
        <InternalLink href="/">Return to homepage</InternalLink>
      </Section>
    </Shell>
  );
};
