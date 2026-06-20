import { type Invoice } from "@/lib/mock-data";
import { formatINR } from "@/lib/format";

export function buildWhatsAppLink(phone: string | undefined, message: string) {
  const text = encodeURIComponent(message);
  const digits = phone?.replace(/[^\d]/g, "");
  if (digits) {
    return `https://wa.me/${digits}?text=${text}`;
  }
  return `https://api.whatsapp.com/send?text=${text}`;
}

export function buildInvoiceMessage(invoice: Invoice) {
  const items = invoice.lineItems?.length
    ? `\n\nItems:\n${invoice.lineItems
        .map((li) => `• ${li.description} x${li.quantity} — ${formatINR(li.quantity * li.rate)}`)
        .join("\n")}`
    : "";
  return `Hi ${invoice.contact}, here is invoice ${invoice.id} from Stitchworks Embroidery.${items}\n\nTotal: ${formatINR(
    invoice.amount
  )}\nDue: ${invoice.dueDate}\nStatus: ${invoice.status}\n\nThank you for your business!`;
}
