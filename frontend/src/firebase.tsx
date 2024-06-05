import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { config } from "./config";

const app = initializeApp(config.firebase);
export const auth = getAuth(app);

export function getCurrentUser() {
  let unsubscribe = null;
  return new Promise((resolve) => {
    unsubscribe = onAuthStateChanged(auth, (user) => resolve(user));
  }).finally(() => unsubscribe());
}
