import React, { memo } from 'react';
import PropTypes from 'prop-types';

const GrowthIcon = ({ colour }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='130 70 300 350'
      style={{ fill: colour }}
    >
      <path d='M332.814 128.443l55.644-9.63-10.763 56.203c-3.383-3.377-6.688-6.333-9.561-9.667-2.013-2.333-3.262-1.854-5.156.014-11.943 11.787-23.961 23.5-35.968 35.225-21.427 20.927-42.893 41.818-64.249 62.818-1.783 1.753-2.672 1.471-4.26-.055-8.962-8.601-18.065-17.057-26.999-25.686-1.742-1.679-2.663-1.808-4.456.002-19.619 19.758-39.359 39.395-58.979 59.146-1.789 1.81-2.733 2.113-4.661.125-5.69-5.871-11.6-11.533-17.511-17.187-1.306-1.251-1.302-1.938-.009-3.221 27.524-27.321 55.029-54.664 82.438-82.102 1.946-1.946 2.805-.747 4.012.394 8.873 8.386 17.778 16.743 26.56 25.225 1.445 1.399 2.092 1.29 3.475-.046 24.447-23.598 48.961-47.132 73.46-70.678 2.144-2.058 4.199-4.23 6.504-6.094 2.063-1.669 1.683-2.779-.089-4.355-3.456-3.081-6.744-6.351-10.098-9.542.221-.294.447-.59.666-.889z'></path>
      <path d='M141.113 315.244H209.652V381.922H141.113z'></path>
      <path d='M229.854 283.811H298.396V381.92199999999997H229.854z'></path>
      <path d='M318.274 241.075H386.815V381.999H318.274z'></path>
    </svg>
  );
};

GrowthIcon.propTypes = {
  colour: PropTypes.string
};

export const GrowthIconSvg = memo(GrowthIcon);
