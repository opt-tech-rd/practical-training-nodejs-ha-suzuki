import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>ログインページ</h1>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        ログイン
      </button>
    </div>
  );
}
