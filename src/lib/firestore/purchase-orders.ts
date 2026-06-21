"use client";

import { useEffect, useState } from "react";
import { addDoc, deleteDoc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getUid, toMillis, userCollection, userDocIn } from "@/lib/firestore/helpers";
import { adjustInventoryQuantity } from "@/lib/firestore/inventory";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/lib/mock-data";

const COLLECTION = "purchaseOrders";

export function usePurchaseOrders() {
  const { user } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPurchaseOrders([]);
      setLoading(false);
      return;
    }
    const q = query(userCollection(user.uid, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPurchaseOrders(
          snapshot.docs.map((d) => {
            const data = d.data();
            return { ...(data as Omit<PurchaseOrder, "id">), id: d.id, createdAt: toMillis(data.createdAt) };
          })
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user]);

  return { purchaseOrders, loading };
}

export async function createPurchaseOrder(data: Omit<PurchaseOrder, "id">) {
  const uid = getUid();
  await addDoc(userCollection(uid, COLLECTION), { ...data, createdAt: serverTimestamp() });
}

/**
 * Updates a purchase order's status. Transitioning into "received" (from any
 * other status) increases inventory quantity for every line item linked to
 * an inventory item — the "plus" side of stock tracking. This only fires
 * once per order: re-saving while already "received" does not double-count.
 */
export async function updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus) {
  const uid = getUid();
  const ref = userDocIn(uid, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) throw new Error("Purchase order not found.");
  const current = snapshot.data() as PurchaseOrder;

  const isNewlyReceived = status === "received" && current.status !== "received";

  await updateDoc(ref, {
    status,
    ...(isNewlyReceived ? { receivedDate: new Date().toISOString().slice(0, 10) } : {}),
  });

  if (isNewlyReceived) {
    for (const item of current.lineItems ?? []) {
      if (item.inventoryItemId) {
        await adjustInventoryQuantity(item.inventoryItemId, Math.abs(item.quantity));
      }
    }
  }
}

export async function deletePurchaseOrder(id: string) {
  const uid = getUid();
  await deleteDoc(userDocIn(uid, COLLECTION, id));
}
