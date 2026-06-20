"use client";

import { useEffect, useState } from "react";
import { addDoc, deleteDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getUid, toMillis, userCollection, userDocIn } from "@/lib/firestore/helpers";
import type { Invoice } from "@/lib/mock-data";

const COLLECTION = "billings";

export function useInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }
    const q = query(userCollection(user.uid, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setInvoices(
          snapshot.docs.map((d) => {
            const data = d.data();
            return { ...(data as Omit<Invoice, "id">), id: d.id, createdAt: toMillis(data.createdAt) };
          })
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user]);

  return { invoices, loading };
}

export function useInvoice(id: string) {
  const { user } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setInvoice(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      userDocIn(user.uid, COLLECTION, id),
      (snapshot) => {
        setInvoice(snapshot.exists() ? { ...(snapshot.data() as Omit<Invoice, "id">), id: snapshot.id } : null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user, id]);

  return { invoice, loading };
}

export async function createInvoice(data: Omit<Invoice, "id">) {
  const uid = getUid();
  await addDoc(userCollection(uid, COLLECTION), { ...data, createdAt: serverTimestamp() });
}

export async function markReminderSent(id: string) {
  const uid = getUid();
  await updateDoc(userDocIn(uid, COLLECTION, id), { lastReminderAt: serverTimestamp() });
}

export async function updateInvoiceDetails(
  id: string,
  data: Partial<Pick<Invoice, "status" | "dueDate" | "reminderDate">>
) {
  const uid = getUid();
  await updateDoc(userDocIn(uid, COLLECTION, id), data);
}

export async function deleteInvoice(id: string) {
  const uid = getUid();
  await deleteDoc(userDocIn(uid, COLLECTION, id));
}
