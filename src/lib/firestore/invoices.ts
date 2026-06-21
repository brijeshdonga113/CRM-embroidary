"use client";

import { useEffect, useState } from "react";
import { addDoc, arrayUnion, deleteDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getUid, toMillis, userCollection, userDocIn } from "@/lib/firestore/helpers";
import { createStockMovement } from "@/lib/firestore/stock";
import { getBalanceDue, getEffectiveStatus, getTotalPaid } from "@/lib/invoice-status";
import { formatINR } from "@/lib/format";
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
        const docs = snapshot.docs.map((d) => {
          const data = d.data();
          return { ...(data as Omit<Invoice, "id">), id: d.id, createdAt: toMillis(data.createdAt) };
        });

        setInvoices(docs.map((invoice) => ({ ...invoice, status: getEffectiveStatus(invoice) })));
        setLoading(false);

        // Self-heal: persist the pending -> overdue transition so every
        // other reader (search, activity, reports) sees the same status.
        for (const invoice of docs) {
          const effective = getEffectiveStatus(invoice);
          if (effective !== invoice.status) {
            void updateDoc(userDocIn(user.uid, COLLECTION, invoice.id), { status: effective });
          }
        }
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
        if (!snapshot.exists()) {
          setInvoice(null);
        } else {
          const raw = { ...(snapshot.data() as Omit<Invoice, "id">), id: snapshot.id };
          setInvoice({ ...raw, status: getEffectiveStatus(raw) });
        }
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
 * linked to an inventory item automatically decreases that item's quantity,
 * logged as a "stock out" movement so it shows up on the Stock page too.
 */
export async function createInvoice(data: Omit<Invoice, "id">) {
  const uid = getUid();
  await addDoc(userCollection(uid, COLLECTION), { ...data, createdAt: serverTimestamp() });

  const today = new Date().toISOString().slice(0, 10);
  for (const item of data.lineItems ?? []) {
    if (item.inventoryItemId) {
      await createStockMovement(
        {
          itemName: item.description,
          type: "out",
          quantity: item.quantity,
          unit: item.unit ?? "",
          date: today,
          reference: `Billed to ${data.firm}`,
          performedBy: "Billing",
        },
        item.inventoryItemId
      );
    }
  }
}

export async function markReminderSent(id: string) {
  const uid = getUid();
  await updateDoc(userDocIn(uid, COLLECTION, id), { lastReminderAt: serverTimestamp() });
}

/**
 * Updates status/due date/reminder date. Refuses to mark an invoice "paid"
 * unless recorded payments actually cover the full amount.
 */
export async function updateInvoiceDetails(
  invoice: Invoice,
  data: Partial<Pick<Invoice, "status" | "dueDate" | "reminderDate">>
) {
  const uid = getUid();
  if (data.status === "paid" && getBalanceDue(invoice) > 0) {
    throw new Error(
      `Can't mark as paid — ${formatINR(getBalanceDue(invoice))} is still outstanding. Record the full payment first.`
    );
  }
  await updateDoc(userDocIn(uid, COLLECTION, invoice.id), data);
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
  const totalPaid = getTotalPaid(invoice) + payment.amount;
  const shouldMarkPaid = totalPaid >= invoice.amount && invoice.status !== "paid";

  await updateDoc(userDocIn(uid, COLLECTION, invoice.id), {
    payments: arrayUnion(newPayment),
    ...(shouldMarkPaid ? { status: "paid" } : {}),
  });
}
