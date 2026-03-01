import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { initState, setUser as setUserState } from './state.js';
import { auth, db, googleProvider, hasFirebaseConfig } from './firebase.js';

const AuthContext = createContext(null);

function mapFirebaseUser(fbUser) {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Foydalanuvchi',
    email: fbUser.email || '',
    isAdmin: fbUser.email?.toLowerCase() === 'admin@emc.uz',
    photoURL: fbUser.photoURL || null,
    provider: 'google'
  };
}

async function upsertUserProfile(fbUser) {
  if (!db) return;

  const ref = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(ref);

  const payload = {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || '',
    photoURL: fbUser.photoURL || '',
    provider: 'google',
    lastLoginAt: serverTimestamp()
  };

  if (!snap.exists()) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(ref, payload, { merge: true });
}

export function AuthProvider({ children }) {
  const [appState, setAppState] = useState(() => initState());
  const user = appState.user;

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) return undefined;

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) return;

      try {
        await upsertUserProfile(fbUser);
      } catch (error) {
        console.error('Firestore upsert error:', error);
      }

      setAppState((s) => setUserState(s, mapFirebaseUser(fbUser)));
    });

    return () => unsub();
  }, []);

  const api = useMemo(() => {
    return {
      user,
      appState,
      setAppState,
      hasGoogleAuth: hasFirebaseConfig,
      login: ({ name, email, isAdmin = false }) => {
        const cleanEmail = email.toLowerCase().trim();
        const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Foydalanuvchi';
        const u = {
          id: cleanEmail,
          name: cleanName,
          email: cleanEmail,
          isAdmin
        };
        setAppState((s) => setUserState(s, u));
      },
      signInWithGoogle: async () => {
        if (!hasFirebaseConfig || !auth || !googleProvider) {
          throw new Error('Firebase sozlanmagan. .env qiymatlarini kiriting.');
        }

        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        await upsertUserProfile(fbUser);

        const mapped = mapFirebaseUser(fbUser);
        setAppState((s) => setUserState(s, mapped));
        return mapped;
      },
      signOutUser: async () => {
        if (hasFirebaseConfig && auth?.currentUser) {
          await signOut(auth);
        }
        setAppState((s) => setUserState(s, null));
      },
      logout: async () => {
        if (hasFirebaseConfig && auth?.currentUser) {
          await signOut(auth);
        }
        setAppState((s) => setUserState(s, null));
      }
    };
  }, [user, appState]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export function getCurrentUser() {
  return auth?.currentUser || null;
}
