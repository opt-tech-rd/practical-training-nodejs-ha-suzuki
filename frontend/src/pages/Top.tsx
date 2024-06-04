import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export default function Top() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>トップページ</h1>
      <div>ログイン中: {user.email}</div>
      <div>user: {JSON.stringify(user)}</div>
      <button
        onClick={() => {
          logout().then(() => navigate("/login"));
        }}
      >
        ログアウト
      </button>
    </div>
  );
}
