import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { config } from "./config";
const app = initializeApp({
    credential: admin.credential.cert(JSON.parse(config.firebase.service_account)),
});
export const auth = getAuth(app);
