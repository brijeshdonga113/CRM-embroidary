"use client";

import { useState } from "react";
import { Bell, Check, Mail, MessageCircle, Phone, Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type Invoice } from "@/lib/mock-data";
import { formatINR, formatDateDisplay } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Channel = "email" | "sms" | "whatsapp";

const channels: { id: Channel; label: string; icon: typeof Mail }[] = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: Phone },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

function defaultMessage(invoice: Invoice) {
  return `Hi ${invoice.contact}, this is a friendly reminder that invoice ${invoice.id} for ${formatINR(
    invoice.amount
  )} (due ${formatDateDisplay(invoice.dueDate)}) from Stitchworks is still ${invoice.status}. Please arrange payment at your earliest convenience. Thank you!`;
}

export function FollowUpSheet({
  invoice,
  sent = false,
  onSent,
}: {
  invoice: Invoice;
  sent?: boolean;
  onSent?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<Channel>("email");
  const [message, setMessage] = useState(() => defaultMessage(invoice));
  const [sending, setSending] = useState(false);

  function handleSend() {
    setSending(true);

    if (channel === "whatsapp") {
      window.open(buildWhatsAppLink(invoice.clientPhone, message), "_blank");
      setSending(false);
      setOpen(false);
      onSent?.();
      return;
    }

    setTimeout(() => {
      setSending(false);
      setOpen(false);
      onSent?.();
    }, 500);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setMessage(defaultMessage(invoice));
      }}
    >
      <SheetTrigger
        render={<Button variant={sent ? "ghost" : "outline"} size="sm" className="gap-1.5" />}
      >
        {sent ? (
          <>
            <Check className="size-3.5" />
            Reminder sent
          </>
        ) : (
          <>
            <Bell className="size-3.5" />
            Follow up
          </>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Send payment reminder</SheetTitle>
          <SheetDescription>
            Follow up with {invoice.firm} about invoice {invoice.id}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3 text-sm">
            <div>
              <p className="font-medium">{invoice.firm}</p>
              <p className="text-xs text-muted-foreground">{invoice.contact}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatINR(invoice.amount)}</p>
              <p className="text-xs text-muted-foreground">Due {formatDateDisplay(invoice.dueDate)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Send via</Label>
            <div className="flex gap-2">
              {channels.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChannel(c.id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    channel === c.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <c.icon className="size-3.5" />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-message">Message</Label>
            <Textarea
              id="reminder-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleSend} disabled={sending} className="gap-1.5">
            <Send className="size-4" />
            {sending ? "Sending…" : "Send Reminder"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
