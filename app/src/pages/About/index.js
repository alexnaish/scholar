import React from 'react';

import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { Paragraph } from '../../components/Paragraph';

export const AboutPage = () => {
  return (
    <Shell>
      <Section title="About" style="grey">
				Back around July 2015, when I was working for <a href="https://www.nowtv.com/">NOWTV</a>, we started discussing how we could track UI changes easily and prevent visual issues slipping into production.
				Turns out, at the time - there wasn&apos;t much out there.
        <Paragraph>We wanted to be able to share results with stakeholders, get <strong>instant</strong> feedback on failures and be able to host it <strong>internally</strong>.</Paragraph>
      </Section>
      <Section>
				With all the gusto and experience of a graduate software engineer,
				I built up an application using the <a href="https://en.wikipedia.org/wiki/MEAN_(solution_stack)">MEAN stack</a> and while it worked at the time, its fallen behind in the modern world of development.
        <Paragraph>
					Nowadays, it should no longer be mandatory to have to manually install and configure a database and a tonne of binaries onto their machine in order to run an application.
					Applications should be deployable on any machine and easily containerised (if that&apos;s your preference).
        </Paragraph>
      </Section>
      <Section title="So here we are again" style="splash">
				So here we are, August 2020 and my current team at the <a href="https://ft.com">Financial Times</a> are discussing visual regression testing.
        <Paragraph>I want to build Scholar in such a way that it is built to last and fit everyone&apos;s needs. I want to run it as a service but not to sacrifice the ability to deploy it to an internal environment.
					It&apos;s <strong>open-source</strong> and <strong>always</strong> will be.</Paragraph>
      </Section>
    </Shell>
  );
};
