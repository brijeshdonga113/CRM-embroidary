import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (typeof window !== "undefined") {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length > 0) {
    console.error(
      `[firebase] Missing config values in this deployed bundle: ${missing.join(", ")}. ` +
        "These read from NEXT_PUBLIC_FIREBASE_* env vars at build time — check they're set " +
        "in your host's dashboard for the environment serving this URL, then redeploy."
    );
  } else {
    console.info(
      `[firebase] Config loaded — apiKey starts with "${firebaseConfig.apiKey?.slice(0, 6)}…", ` +
        `projectId: "${firebaseConfig.projectId}".`
    );
  }
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
