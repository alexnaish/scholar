import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';

import { AuthContext } from '../contexts/Auth';
import { storeSession, refresh, clearSession, logout } from '../contexts/Auth/actions';

export default function useFetch({ method = 'get', path, data = null }) {
  const [auth, dispatch] = useContext(AuthContext);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const setLocation = useLocation()[1];

  const instance = axios.create({
    baseURL: process.env.API_URL
  });
  instance.interceptors.request.use((config) => {
    config.headers['authorization'] = `Bearer ${auth.accessToken}`;
    return config;
  });
  instance.interceptors.response.use((response) => {
    const newAccessToken = response.headers['x-access-token'];
    if (newAccessToken) {
      storeSession({ ...auth, accessToken: newAccessToken });
      refresh(dispatch)(newAccessToken);
    }
    return response;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await instance[method](path, JSON.parse(data));
        setResponse(res.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          clearSession();
          logout(dispatch)();
          return setLocation('/login?errorCode=expired', true);
        }

        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [method, path, data]);

  return { response, error, loading };
}
