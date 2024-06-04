import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";

type EmailType = string | undefined;
type PasswordType = string | undefined;

export function useAuth() {
  const [user, setUser] = useState(auth.currentUser);

  const createUser = (email: EmailType, password: PasswordType) => {
    if (email === undefined || password === undefined) {
      return;
    }

    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        return sendEmailVerification(user).then(() => {
          alert(
            "確認メールが送信されました。URLをクリックし認証を行ってください: " +
              user.email
          );
        });
      }
    );
  };

  const login = (email: EmailType, password: PasswordType) => {
    if (email === undefined || password === undefined) {
      return;
    }

    return signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        console.log("IDトークン: ");
        console.log(userCredential.user?.getIdToken());
      }
    );
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (_user) => setUser(_user));
  }, []);

  return {
    user: user?.emailVerified ? user : null,
    createUser,
    login,
    logout,
  };
}
