"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  type User,
} from "firebase/auth";
import { getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { userDoc } from "@/lib/firestore/helpers";

async function ensureUserDoc(uid: string, defaults: { businessName?: string; email?: string }) {
  const ref = userDoc(uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, { ...defaults, createdAt: serverTimestamp() });
  }
}

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(name: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }
    await ensureUserDoc(credential.user.uid, { businessName: name, email });
  }

  async function signInWithGoogle() {
    const credential = await signInWithPopup(auth, new GoogleAuthProvider());
    await ensureUserDoc(credential.user.uid, {
      businessName: credential.user.displayName ?? "",
      email: credential.user.email ?? "",
    });
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  async function updateDisplayName(name: string) {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name });
    setUser({ ...auth.currentUser });
  }

  async function changePassword(newPassword: string) {
    if (!auth.currentUser) return;
    await updatePassword(auth.currentUser, newPassword);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateDisplayName,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
