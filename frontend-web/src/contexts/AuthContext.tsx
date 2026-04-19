"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
  User,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";

  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;


  const [user, setUser] = useState<User | null>(null);

    const unsub = onAuthStateChanged(auth, (u) => {
      setLoading(false);
    return unsub;

    await signInWithEmailAndPassword(auth, email, password);

    await createUserWithEmailAndPassword(auth, email, password);

    await signOut(auth);

    const provider = new GoogleAuthProvider();
  };
  const resetPassword = async (email: string) => {
  };
  return (
      {children}
  );

  const ctx = useContext(AuthContext);
  return ctx;
