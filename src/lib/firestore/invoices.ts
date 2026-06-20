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
import type { Invoice } from "@/lib/mock-data";

const COLLECTION = "invoices";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setInvoices(snapshot.docs.map((d) => ({ ...(d.data() as Omit<Invoice, "id">), id: d.id })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  return { invoices, loading };
}

export function useInvoice(id: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, COLLECTION, id),
      (snapshot) => {
        setInvoice(snapshot.exists() ? { ...(snapshot.data() as Omit<Invoice, "id">), id: snapshot.id } : null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [id]);

  return { invoice, loading };
}

export async function createInvoice(data: Omit<Invoice, "id">) {
  await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() });
}

export async function markReminderSent(id: string) {
  await updateDoc(doc(db, COLLECTION, id), { lastReminderAt: serverTimestamp() });
}

export async function deleteInvoice(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}
