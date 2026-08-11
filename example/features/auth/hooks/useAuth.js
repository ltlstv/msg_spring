import { useState } from 'react';
import {
  clearAuth,
  getStoredAuth,
  saveAuth,
} from '../../../shared/storage/authStorage.js';
import { loginUser, registerUser } from '../api/authApi.js';

export function useAuth() {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function authenticate(mode, credentials) {
    setError('');
    setIsPending(true);

    try {
      const request = mode === 'register' ? registerUser : loginUser;
      const data = await request(credentials);
      const nextAuth = {
        token: data.token,
        user: { username: credentials.username },
      };

      saveAuth({ token: data.token, username: credentials.username });
      setAuth(nextAuth);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPending(false);
    }
  }

  function logout() {
    clearAuth();
    setAuth({ token: null, user: null });
  }

  return {
    ...auth,
    error,
    isPending,
    login: (credentials) => authenticate('login', credentials),
    register: (credentials) => authenticate('register', credentials),
    logout,
  };
}
