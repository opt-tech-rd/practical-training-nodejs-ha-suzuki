import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { config } from "./config.js";
const app = initializeApp({
    credential: admin.credential.cert(config.firebase.serviceAccount)
});
export const auth = getAuth(app);
