import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Can, updateAbility } from "../casl";

export default function Schedules() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div>
      <h1>スケジュールリスト</h1>
      <div>
        ログイン中のユーザ:{" "}
        {JSON.stringify({ email: user.email })}
      </div>
      <button onClick={() => navigate("/schedules/create")}>スケジュール登録</button>
      <button onClick={() => navigate("/")}>トップページ</button>
    </div>
  );
}
