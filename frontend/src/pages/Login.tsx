import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordlRef = useRef<HTMLInputElement>(null);
  const { login, createUser } = useAuth();

  return (
    <div>
      <h1>ログインページ</h1>
      <div>
        <label>E-mail: </label>
        <input ref={emailRef} type="email"></input>
      </div>
      <div>
        <label>Password: </label>
        <input ref={passwordlRef} type="password"></input>
      </div>
      <button
        onClick={() => {
          const email = emailRef.current?.value;
          const password = passwordlRef.current?.value;
          login(email, password).then(() => navigate("/"));
        }}
      >
        ログイン
      </button>
      <button
        onClick={() => {
          const email = emailRef.current?.value;
          const password = passwordlRef.current?.value;
          createUser(email, password);
        }}
      >
        ユーザ作成
      </button>
    </div>
  );
}
