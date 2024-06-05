import { initializeApp } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

const app = initializeApp();
const auth = getAuth(app);

export default auth as Auth;
