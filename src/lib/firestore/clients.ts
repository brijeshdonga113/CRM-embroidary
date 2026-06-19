"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Client } from "@/lib/mock-data";

const COLLECTION = "clients";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setClients(snapshot.docs.map((d) => ({ ...(d.data() as Omit<Client, "id">), id: d.id })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  return { clients, loading };
}

export async function createClient(data: Omit<Client, "id">) {
  await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() });
}

export async function deleteClient(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}
