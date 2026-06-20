"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { getUid } from "@/lib/firestore/helpers";

export async function uploadDesignFile(file: File): Promise<string> {
  const uid = getUid();
  const path = `users/${uid}/designs/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
