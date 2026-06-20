"use client";

import { useEffect, useState } from "react";
import { onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getUid, userDoc } from "@/lib/firestore/helpers";

export type NotificationPrefs = {
  paymentReminders: boolean;
  lowStock: boolean;
  orderUpdates: boolean;
};

export type UserProfile = {
  businessName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  invoicePrefix?: string;
  dueTermsDays?: number;
  taxRate?: number;
  notifications?: NotificationPrefs;
};

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      userDoc(user.uid),
      (snapshot) => {
        setProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user]);

  return { profile, loading };
}

export async function updateUserProfile(data: Partial<UserProfile>) {
  const uid = getUid();
  await setDoc(userDoc(uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
