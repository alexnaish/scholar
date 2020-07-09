import React from 'react';

import './style.scss';

export const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__spinner"></div>
      Loading...
    </div>
  );
};
