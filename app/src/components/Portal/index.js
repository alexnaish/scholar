import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

let portalElement;

export const Portal = ({ children }) => {
  // For SSR
  if (typeof window === 'undefined') {
    return null;
  }

  const [element] = useState(document.createElement('div'));
  useEffect(() => {
    // Create the DOM node if its not already there
    if (!portalElement) {
      portalElement = document.createElement('div');
      portalElement.dataset.name = 'portal-container';
      document.body.appendChild(portalElement);
    }

    portalElement.appendChild(element);
    return () => {
      portalElement.removeChild(element);
    };
  }, []);

  return createPortal(children, element);
};
