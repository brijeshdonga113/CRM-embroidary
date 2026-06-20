"use client";

import { useEffect, useState } from "react";
import { addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getUid, toMillis, userCollection } from "@/lib/firestore/helpers";
import type { StockMovement } from "@/lib/mock-data";
import { adjustInventoryQuantity } from "@/lib/firestore/inventory";

const COLLECTION = "stockMovements";

export function useStockMovements() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMovements([]);
      setLoading(false);
      return;
    }
    const q = query(userCollection(user.uid, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMovements(
          snapshot.docs.map((d) => {
            const data = d.data();
            return { ...(data as Omit<StockMovement, "id">), id: d.id, createdAt: toMillis(data.createdAt) };
          })
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user]);

  return { movements, loading };
}

export async function createStockMovement(data: Omit<StockMovement, "id">, inventoryItemId?: string) {
  const uid = getUid();
  await addDoc(userCollection(uid, COLLECTION), { ...data, createdAt: serverTimestamp() });

  if (inventoryItemId) {
    const signedQuantity =
      data.type === "out" ? -Math.abs(data.quantity) : data.type === "in" ? Math.abs(data.quantity) : data.quantity;
    await adjustInventoryQuantity(inventoryItemId, signedQuantity);
  }
}
