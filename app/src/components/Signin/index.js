import React from 'react';
import { Section } from '../Section';

import './style.scss';

const triggerOverlay = (provider) => {
  alert(provider);
};

export const Signin = () => {
  return (
    <Section title="Sign In">
      <button className="social-button social-button--google" onClick={() => triggerOverlay('google')}>Log in with Google</button>
      <button className="social-button social-button--github" onClick={() => triggerOverlay('github')}>Log in with GitHub</button>
    </Section>
  );
};
