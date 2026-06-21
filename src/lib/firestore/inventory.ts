"use client";

import { useEffect, useState } from "react";
import { addDoc, deleteDoc, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getUid, toMillis, userCollection, userDocIn } from "@/lib/firestore/helpers";
import type { InventoryItem } from "@/lib/mock-data";

const COLLECTION = "inventoryItems";

export function useInventoryItems() {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const q = query(userCollection(user.uid, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setItems(
          snapshot.docs.map((d) => {
            const data = d.data();
            return { ...(data as Omit<InventoryItem, "id">), id: d.id, createdAt: toMillis(data.createdAt) };
          })
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user]);

  return { items, loading };
}

export async function createInventoryItem(data: Omit<InventoryItem, "id">, designFileUrl?: string) {
  const uid = getUid();
  await addDoc(userCollection(uid, COLLECTION), {
    ...data,
    ...(designFileUrl ? { designFileUrl } : {}),
    createdAt: serverTimestamp(),
  });
}

export async function adjustInventoryQuantity(id: string, delta: number) {
  const uid = getUid();
  await updateDoc(userDocIn(uid, COLLECTION, id), { quantity: increment(delta) });
}

/**
 * Edits catalog/master data for an existing item — name, SKU, category,
 * unit, supplier, reorder level, and pricing. Quantity is intentionally
 * excluded: stock levels only change through Stock Entries, Purchase Order
 * receipts, or bills, so every quantity change stays in the stock ledger.
 */
export async function updateInventoryItem(
  id: string,
  data: Partial<Omit<InventoryItem, "id" | "quantity" | "createdAt">>
) {
  const uid = getUid();
  await updateDoc(userDocIn(uid, COLLECTION, id), data);
}

export async function deleteInventoryItem(id: string) {
  const uid = getUid();
  await deleteDoc(userDocIn(uid, COLLECTION, id));
}
