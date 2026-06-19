import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FormFooter({
  cancelHref,
  saving,
  saveLabel = "Save",
}: {
  cancelHref: string;
  saving?: boolean;
  saveLabel?: string;
}) {
  return (
    <div className="flex items-center justify-end gap-2 border-t pt-4">
      <Button type="button" variant="outline" render={<Link href={cancelHref} />}>
        Cancel
      </Button>
      <Button type="submit" disabled={saving} className="gap-1.5">
        {saving ? "Saving…" : saveLabel}
      </Button>
    </div>
  );
}
