import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

import { Portal } from '../Portal';
import { removeScrolling } from '../../utils/scrolling';

import './style.scss';

const styles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

export const Overlay = ({
  children,
  closeOnClick = true,
  preventScrolling = true,
  display = true,
  onClose,
}) => {
  const handleClose = () => {
    onClose && onClose();
    removeScrolling(false);
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      handleClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnClick) {
      handleClose();
    }
  };

  useEffect(() => {
    preventScrolling && removeScrolling(display);
    document.body.addEventListener('keydown', handleEscape, false);
    return () => {
      removeScrolling(false);
      document.body.removeEventListener('keydown', handleEscape, false);
    };
  }, [display]);

  return (
    <Portal>
      <Transition appear unmountOnExit timeout={150} in={display}>
        {(state) => {
          return (
            <div
              className="overlay"
              style={styles[state]}
              onClick={handleBackdropClick}
            >
              {typeof children === 'function'
                ? children({
                  state,
                  close: handleClose,
                })
                : children}
            </div>
          );
        }}
      </Transition>
    </Portal>
  );
};

Overlay.propTypes = {
  onClose: PropTypes.func.isRequired,
  closeOnClick: PropTypes.bool,
  preventScrolling: PropTypes.bool,
  display: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};
