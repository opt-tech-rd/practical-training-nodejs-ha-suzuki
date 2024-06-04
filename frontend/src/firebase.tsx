import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnKuIgcSOqSh2pf8jo5JtRph-V1a0lmyc",
  authDomain: "tech-induction-training-2024.firebaseapp.com",
  projectId: "tech-induction-training-2024",
  storageBucket: "tech-induction-training-2024.appspot.com",
  messagingSenderId: "1009695668156",
  appId: "1:1009695668156:web:d7408af8be3392f4f3ddb9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export function getCurrentUser() {
  let unsubscribe = null;
  return new Promise((resolve) => {
    unsubscribe = onAuthStateChanged(auth, (user) => resolve(user));
  }).finally(() => unsubscribe());
}
