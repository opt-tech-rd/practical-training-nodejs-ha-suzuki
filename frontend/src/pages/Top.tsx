import { useNavigate } from "react-router-dom";

export default function Top() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>トップページ</h1>
      <button
        onClick={() => {
          navigate("/login");
        }}
      >
        ログアウト
      </button>
    </div>
  );
}
