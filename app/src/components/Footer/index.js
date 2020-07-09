import React from 'react';
import { Link } from 'wouter';

import './style.scss';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">

        <div className="footer__columns">
          <div className="footer__contact">
            <div className="footer__contact-title">Have a question?</div>
            <div className="footer__contact-message">Feel free to contact me with issues, comments or suggestions!</div>
            <div className="footer__contact-options">
              <a title="GitHub" href="https://github.com/alexnaish" target="_blank" rel="noopener noreferrer" className="footer__contact-link footer__contact-link--github">Github</a>
              <a title="LinkedIn" href="https://www.linkedin.com/in/alexnaish/" target="_blank" rel="noopener noreferrer" className="footer__contact-link footer__contact-link--linkedin">LinkedIn</a>
              <a title="Homepage" href="https://naish.io" target="_blank" rel="noopener noreferrer" className="footer__contact-link footer__contact-link--website">Website</a>
            </div>
          </div>
          <div className="footer__links-panel">
            <div className="footer__links-column">
              <span className="footer__links-header">
                Useful Links
              </span>
              <nav className="footer__links">
                <Link href="/about">
                  <a className="footer__link">
                    About
                  </a>
                </Link>
                <Link href="/privacy">
                  <a className="footer__link">
                    Privacy
                  </a>
                </Link>
              </nav>
            </div>
            <div className="footer__links-column">
              <span className="footer__links-header">
                Other Links
              </span>
              <nav className="footer__links">
                <a className="footer__link" href="https://github.com/alexnaish/scholar" target="_blank" rel="noopener noreferrer">
                  Code repository
                </a>
                <a href="https://unsplash.com/" className="footer__link" target="_blank" rel="noopener noreferrer">
                  Unsplash
                </a>
                <a href="https://icons8.com/" className="footer__link" target="_blank" rel="noopener noreferrer">
                  Icons CDN
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="footer__copyright">
          Copyright &copy; {new Date().getFullYear()} Alex Naish Ltd
        </div>

      </div>
    </footer>
  );
};
