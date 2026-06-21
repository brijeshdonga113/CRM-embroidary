"use client";

import { useEffect, useState } from "react";
import { addDoc, arrayUnion, deleteDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getUid, toMillis, userCollection, userDocIn } from "@/lib/firestore/helpers";
import { adjustInventoryQuantity } from "@/lib/firestore/inventory";
import type { Invoice, InvoicePayment } from "@/lib/mock-data";

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

/**
 * Creating a bill is the "minus" side of stock tracking: any line item
 * linked to an inventory item automatically decreases that item's quantity.
 */
export async function createInvoice(data: Omit<Invoice, "id">) {
  const uid = getUid();
  await addDoc(userCollection(uid, COLLECTION), { ...data, createdAt: serverTimestamp() });

  for (const item of data.lineItems ?? []) {
    if (item.inventoryItemId) {
      await adjustInventoryQuantity(item.inventoryItemId, -Math.abs(item.quantity));
    }
  }
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

/**
 * Records a partial (or full) payment against an invoice. If the running
 * total of payments reaches the invoice amount, status auto-flips to "paid".
 */
export async function recordInvoicePayment(invoice: Invoice, payment: Omit<InvoicePayment, "id">) {
  const uid = getUid();
  const newPayment: InvoicePayment = {
    ...payment,
    id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  const totalPaid = (invoice.payments ?? []).reduce((sum, p) => sum + p.amount, 0) + payment.amount;
  const shouldMarkPaid = totalPaid >= invoice.amount && invoice.status !== "paid";

  await updateDoc(userDocIn(uid, COLLECTION, invoice.id), {
    payments: arrayUnion(newPayment),
    ...(shouldMarkPaid ? { status: "paid" } : {}),
  });
}
