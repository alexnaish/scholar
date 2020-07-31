import React from 'react';
import PropTypes from 'prop-types';

import { Header } from '../Header';
import { ErrorBoundary } from '../ErrorBoundary';
import { Footer } from '../Footer';

import './style.scss';

export const Shell = ({ children }) => {
  return (
    <div className="shell">
      <Header />
      <ErrorBoundary>
        <main id="site-content" className="shell__content">{children}</main>
      </ErrorBoundary>
      <Footer />
    </div>
  );
};

Shell.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
