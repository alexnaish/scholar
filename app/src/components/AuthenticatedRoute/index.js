import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, useLocation, useRoute } from 'wouter';

import { AuthContext } from '../../contexts/Auth';

export const AuthenticatedRoute = ({ path, component }) => {
  const [match] = useRoute(path);
  const setLocation = useLocation()[1];
  const [state] = useContext(AuthContext);
  const allowed = (match && state.accessToken) || null;

  useEffect(() => {
    if (!allowed) {
      setLocation('/login', true);
    }
  }, [match]);

  return allowed && <Route path={path} component={component} />;
};

AuthenticatedRoute.propTypes = {
  path: PropTypes.string,
  component: PropTypes.elementType,
};
