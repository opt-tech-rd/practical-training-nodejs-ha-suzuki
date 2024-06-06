import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>ユーザー管理ページ</h1>
      <button onClick={() => navigate("/")}>トップページ</button>
    </div>
  );
}
