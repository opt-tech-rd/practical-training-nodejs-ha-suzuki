import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
const app = initializeApp({ projectId: "tech-induction-training-2024" });
const auth = getAuth(app);
export default auth;
