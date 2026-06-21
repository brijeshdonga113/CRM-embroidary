"use client";

import { useEffect, useState } from "react";
import { addDoc, deleteDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getUid, toMillis, userCollection, userDocIn } from "@/lib/firestore/helpers";
import type { Order } from "@/lib/mock-data";

const COLLECTION = "orders";

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const q = query(userCollection(user.uid, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setOrders(
          snapshot.docs.map((d) => {
            const data = d.data();
            return { ...(data as Omit<Order, "id">), id: d.id, createdAt: toMillis(data.createdAt) };
          })
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user]);

  return { orders, loading };
}

export function useOrder(id: string) {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) {
      setOrder(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      userDocIn(user.uid, COLLECTION, id),
      (snapshot) => {
        setOrder(snapshot.exists() ? { ...(snapshot.data() as Omit<Order, "id">), id: snapshot.id } : null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user, id]);

  return { order, loading };
}

export async function createOrder(data: Omit<Order, "id">) {
  const uid = getUid();
  await addDoc(userCollection(uid, COLLECTION), { ...data, createdAt: serverTimestamp() });
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const uid = getUid();
  await updateDoc(userDocIn(uid, COLLECTION, id), { status });
}

export async function deleteOrder(id: string) {
  const uid = getUid();
  await deleteDoc(userDocIn(uid, COLLECTION, id));
}
