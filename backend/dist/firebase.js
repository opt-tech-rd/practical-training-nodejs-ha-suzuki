import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { config } from "./config.js";
const app = initializeApp({
    credential: admin.credential.cert(JSON.parse(config.firebase.service_account)),
    projectId: config.firebase.project_id,
});
export const auth = getAuth(app);
