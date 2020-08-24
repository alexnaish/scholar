import React from 'react';

import { Shell } from '../../components/Shell';
import { Section } from '../../components/Section';
import { Paragraph } from '../../components/Paragraph';

export const PrivacyPage = () => {
  return (
    <Shell>
      <Section title="Privacy Policy" style="grey">
				This Privacy Policy describes how your personal information is collected, used, and shared when you visit or interact with https://scholar.naish.io (the “Site”).
      </Section>
      <Section title="What information will be collected?" style="white">
				When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address and time zone.
				Additionally, as you browse the Site, we collect information about the individual web pages that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.
				We refer to this automatically-collected information as “Device Information.”
        <Paragraph>
					We collect Device Information using the following technologies:
        </Paragraph>
        <ul>
          <li>
							Log files track actions occurring on the Site.
          </li>
          <li>
							Error reporting software tracks information about your browser.
          </li>
          <li>
							“Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.
          </li>
        </ul>
        <Paragraph>
					Additionally when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, payment information, email address, and phone number. We refer to this information as “Order Information.”
        </Paragraph>
        <Paragraph>
					When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.
        </Paragraph>
      </Section>
      <Section title="How do we use your Personal Information?" style="grey">
				We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information and providing you with invoices and/or order confirmations).
        <Paragraph>
					We use the Device Information that we collect to help us optimize and monitor the Site.
        </Paragraph>
        <Paragraph>
					Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
        </Paragraph>
        <Paragraph>
					The security and privacy breakdown is as follows:
        </Paragraph>
        <ul>
          <li>
						All user authentication is managed via social OAuth 2.0 links such as your Google account. We store your first name and email for use throughout the Site. No user passwords are stored within the Site.
          </li>
          <li>
						All payment related activity is managed with <a href="https://stripe.com">Stripe</a>. No payment details are stored within the Site.
          </li>
          <li>
						Device Information will be stored by <a href="http://analytics.google.com/">Google Analytics</a> and by <a href="https://newrelic.com/">New Relic</a> for application analytics and error monitoring respectively.
          </li>
        </ul>
      </Section>
      <Section title="Your rights" style="white">
				If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted.
				If you would like to exercise this right, please contact us through the contact information below.
        <Paragraph>Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above.</Paragraph>
				Additionally, please note that your information will be transferred outside of Europe, including the United States.
      </Section>
      <Section title="Data Retention" style="grey">
				When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
        <Paragraph>Upon deletion of your account, all data will be removed from our records.</Paragraph>
      </Section>
      <Section title="Changes" style="white">
				We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
      </Section>
      <Section title="Contact" style="grey">
			For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <strong>alex@naish.io</strong>.
      </Section>
    </Shell>
  );
};
