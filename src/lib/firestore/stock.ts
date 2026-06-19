"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { StockMovement } from "@/lib/mock-data";
import { adjustInventoryQuantity } from "@/lib/firestore/inventory";

const COLLECTION = "stockMovements";

export function useStockMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMovements(snapshot.docs.map((d) => ({ ...(d.data() as Omit<StockMovement, "id">), id: d.id })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  return { movements, loading };
}

export async function createStockMovement(data: Omit<StockMovement, "id">, inventoryItemId?: string) {
  await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() });

  if (inventoryItemId) {
    const signedQuantity =
      data.type === "out" ? -Math.abs(data.quantity) : data.type === "in" ? Math.abs(data.quantity) : data.quantity;
    await adjustInventoryQuantity(inventoryItemId, signedQuantity);
  }
}
