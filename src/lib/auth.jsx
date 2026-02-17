import React, { createContext, useContext, useMemo, useState } from 'react';
import { initState, setUser as setUserState } from './state.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [appState, setAppState] = useState(() => initState());

  const user = appState.user;

  const api = useMemo(() => {
    return {
      user,
      appState,
      setAppState,
      login: ({ name, email, isAdmin = false }) => {
        const u = {
          id: email.toLowerCase().trim(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          isAdmin
        };
        setAppState((s) => setUserState(s, u));
      },
      logout: () => setAppState((s) => setUserState(s, null))
    };
  }, [user, appState]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
