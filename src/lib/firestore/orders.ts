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
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/mock-data";

const COLLECTION = "orders";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setOrders(snapshot.docs.map((d) => ({ ...(d.data() as Omit<Order, "id">), id: d.id })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  return { orders, loading };
}

export async function createOrder(data: Omit<Order, "id">) {
  await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() });
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  await updateDoc(doc(db, COLLECTION, id), { status });
}

export async function deleteOrder(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}
