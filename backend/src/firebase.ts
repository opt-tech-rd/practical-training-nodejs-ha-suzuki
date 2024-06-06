import * as dotenv from 'dotenv'
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

dotenv.config()

const app = initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG))
});
export const auth = getAuth(app);
