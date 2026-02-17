// src/lib/auth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase.js";

const AuthCtx = createContext(null);

const ADMIN_EMAILS = new Set(["admin@emc.uz"]); // kerak bo‘lsa ko‘paytirasan

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setUser(null);
        setBooting(false);
        return;
      }
      const email = (u.email || "").toLowerCase();
      setUser({
        id: u.uid,
        name: u.displayName || "Foydalanuvchi",
        email: u.email || "",
        isAdmin: ADMIN_EMAILS.has(email),
        photoURL: u.photoURL || "",
      });
      setBooting(false);
    });
    return () => unsub();
  }, []);

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signUpEmail = async ({ name, email, password }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    // user state onAuthStateChanged orqali yangilanadi
  };

  const loginEmail = async ({ email, password }) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        booting,
        loginGoogle,
        signUpEmail,
        loginEmail,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
