import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Overlay } from '../Overlay';

import './style.scss';

const getSizeAttribute = (position) => {
  switch (position) {
    case 'right':
    case 'left':
      return { sizeAttribute: 'width', minSizeAttribute: 'minWidth' };
    case 'top':
    case 'bottom':
      return { sizeAttribute: 'height', minSizeAttribute: 'minHeigh' };
  }
};

export const OffscreenSection = ({
  onClose,
  preventScrolling,
  display,
  position = 'right',
  closeOnOverlayClick = true,
  size,
  minSize,
  children,
}) => {
  const { sizeAttribute, minSizeAttribute } = getSizeAttribute(position);

  return (
    <Overlay
      closeOnClick={closeOnOverlayClick}
      onClose={onClose}
      preventScrolling={preventScrolling}
      display={display}
    >
      {({ state, close }) => {
        return (
          <div
            className={classNames('offscreen', {
              [`offscreen--${[position]}`]: !!position,
              'offscreen--displayed': state === 'entered',
            })}
            style={{ [sizeAttribute]: size, [minSizeAttribute]: minSize }}
          >
            <button className="offscreen__close" aria-label="Close overlay" onClick={() => close()}>
              X
            </button>
            <div className="offscreen__container" role="dialog">{children}</div>
          </div>
        );
      }}
    </Overlay>
  );
};

OffscreenSection.propTypes = {
  onClose: PropTypes.func.isRequired,
  closeOnOverlayClick: PropTypes.bool,
  preventScrolling: PropTypes.bool,
  display: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  position: PropTypes.string,
  size: PropTypes.string,
  minSize: PropTypes.string,
};
