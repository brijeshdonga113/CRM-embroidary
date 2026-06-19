"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { InventoryItem } from "@/lib/mock-data";

const COLLECTION = "inventoryItems";

export function useInventoryItems() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setItems(snapshot.docs.map((d) => ({ ...(d.data() as Omit<InventoryItem, "id">), id: d.id })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  return { items, loading };
}

export async function createInventoryItem(data: Omit<InventoryItem, "id">, designFileUrl?: string) {
  await addDoc(collection(db, COLLECTION), {
    ...data,
    ...(designFileUrl ? { designFileUrl } : {}),
    createdAt: serverTimestamp(),
  });
}

export async function adjustInventoryQuantity(id: string, delta: number) {
  await updateDoc(doc(db, COLLECTION, id), { quantity: increment(delta) });
}

export async function deleteInventoryItem(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}
