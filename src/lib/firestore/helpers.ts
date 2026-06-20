import { collection, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export function getUid() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("You must be signed in to do this.");
  return uid;
}

export function userDoc(uid: string) {
  return doc(db, "users", uid);
}

export function userCollection(uid: string, name: string) {
  return collection(db, "users", uid, name);
}

export function userDocIn(uid: string, name: string, id: string) {
  return doc(db, "users", uid, name, id);
}

/** Best-effort conversion of a Firestore Timestamp field to epoch millis. */
export function toMillis(value: unknown): number | undefined {
  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof (value as { toMillis: unknown }).toMillis === "function"
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }
  return undefined;
}
