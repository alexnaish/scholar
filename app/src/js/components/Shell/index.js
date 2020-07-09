import React from 'react';
import PropTypes from 'prop-types';
import { AuthProvider } from '../../contexts/Auth';
import { Header } from '../Header';
import { Footer } from '../Footer';

import './style.scss';

export const Shell = ({ children }) => {
  return (
    <AuthProvider>
      <div className="shell">
        <Header />
        <main id="site-content" className="shell__content">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

Shell.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
