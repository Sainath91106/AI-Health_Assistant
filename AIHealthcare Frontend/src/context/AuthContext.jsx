import { createContext, useEffect, useMemo, useState } from 'react';
import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '../common/constants';
import { loginUser, registerUser } from '../services/authService';

export const AuthContext = createContext(null);

const normalizeAuthPayload = (payload = {}) => {
  const token = payload.token || payload.accessToken || payload.jwt;
  const user = {
    _id: payload._id || payload.id || payload.userId || '',
    name: payload.name || payload.user?.name || 'Healthcare User',
    email: payload.email || payload.user?.email || '',
  };

  return { token, user };
};

const persistAuth = (token, user) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

const clearPersistedAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        clearPersistedAuth();
      }
    }

    setIsBootstrapping(false);
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const { token: authToken, user: authUser } = normalizeAuthPayload(response);

    if (!authToken) {
      throw new Error('Token missing in login response');
    }

    persistAuth(authToken, authUser);
    setToken(authToken);
    setUser(authUser);

    return authUser;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    const { token: authToken, user: authUser } = normalizeAuthPayload(response);

    if (authToken) {
      persistAuth(authToken, authUser);
      setToken(authToken);
      setUser(authUser);
    }

    return authUser;
  };

  const logout = () => {
    clearPersistedAuth();
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isBootstrapping,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
