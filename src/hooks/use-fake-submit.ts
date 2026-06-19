"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function useFakeSubmit(redirectTo: string) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      router.push(redirectTo);
    }, 600);
  }

  return { saving, submit };
}
