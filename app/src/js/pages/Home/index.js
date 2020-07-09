import React, { useState } from 'react';

import { Section } from '../../components/Section';
import { CallToAction } from '../../components/Button';
import { Shell } from '../../components/Shell';
import { OffscreenSection } from '../../components/OffscreenSection';
import { Promo } from '../../components/Promo';
import { Paragraph } from '../../components/Paragraph';
import { GithubIconSvg } from '../../components/GithubIconSvg';
import { GrowthIconSvg } from '../../components/GrowthIconSvg';
import { HubIconSvg } from '../../components/HubIconSvg';
import { Signin } from '../../components/Signin';

import './style.scss';

export const HomePage = () => {
  const [showOverlay, setShowSigninOverlay] = useState(false);
  return (
    <Shell>
      <div className="intro">
        <div className="intro__container">
          <div className="intro__content">
            <h1 className="intro__title">Visual testing made easy.</h1>
            <span>Catch regressions before they become an issue.</span>
            <CallToAction centre onClick={() => setShowSigninOverlay(true)}>
              Get Started
            </CallToAction>
          </div>
        </div>
      </div>
      <Section title="Built to grow">
        <Promo
          imageElement={<GrowthIconSvg colour="var(--dark)" />}
        >
          <Paragraph>Whether you&apos;re testing one image or thousands, Scholar was built on top of CDN and Serverless tech - offering endless scaling capabilities to meet all demands.</Paragraph>
        </Promo>
      </Section>
      <Section title="Open Source" style="splash">
        <Promo
          buttonStyle="dark"
          imageElement={<GithubIconSvg colour="var(--darkest-blue)" />}
          link={{ href: 'https://github.com/alexnaish/scholar', text: 'View on GitHub' }}
        >
          <Paragraph>All Scholar&apos;s code can be found on GitHub and is available to view, feedback and contribute to. Pull requests, well formed issues and feature requests are more than welcome!</Paragraph>
        </Promo>
      </Section>
      <Section title="Social Integration" style="grey">
        <Promo
          imageElement={<HubIconSvg colour="var(--dark)" />}
        >
          <Paragraph>Benefit from improved security and usability by using your existing social accounts. You&apos;ll never need to worry about your details being exposed or trying to remember yet another password.</Paragraph>
        </Promo>
      </Section>

      <OffscreenSection
        display={showOverlay}
        onClose={() => setShowSigninOverlay(false)}
      >
        <Signin />
      </OffscreenSection>
    </Shell>
  );
};
