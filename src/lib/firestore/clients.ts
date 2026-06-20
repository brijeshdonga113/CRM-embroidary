"use client";

import { useEffect, useState } from "react";
import { addDoc, deleteDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getUid, toMillis, userCollection, userDocIn } from "@/lib/firestore/helpers";
import type { Client } from "@/lib/mock-data";

const COLLECTION = "clients";

export function useClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }
    const q = query(userCollection(user.uid, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setClients(
          snapshot.docs.map((d) => {
            const data = d.data();
            return { ...(data as Omit<Client, "id">), id: d.id, createdAt: toMillis(data.createdAt) };
          })
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user]);

  return { clients, loading };
}

export async function createClient(data: Omit<Client, "id">) {
  const uid = getUid();
  await addDoc(userCollection(uid, COLLECTION), { ...data, createdAt: serverTimestamp() });
}

export async function deleteClient(id: string) {
  const uid = getUid();
  await deleteDoc(userDocIn(uid, COLLECTION, id));
}
