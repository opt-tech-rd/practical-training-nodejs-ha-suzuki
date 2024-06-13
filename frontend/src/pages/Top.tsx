import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useQuery, gql } from "@apollo/client";
import { Can } from "../casl";

const WHO_AM_I = gql`
  query WhoAmI {
    whoAmI {
      uid
      email
    }
  }
`;

export default function Top() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { loading, error, data } = useQuery(WHO_AM_I, {
    fetchPolicy: "no-cache",
  });

  return (
    <div>
      <h1>トップページ</h1>
      <div>
        ログイン中のユーザ:{" "}
        {JSON.stringify({ email: user.email })}
      </div>
      <button
        onClick={() => {
          logout().then(() => {
            navigate("/login");
          });
        }}
      >
        ログアウト
      </button>
      <Can do="read" on="User">
        <button onClick={() => navigate("/users")}>ユーザー管理</button>
      </Can>
      <Can do="read" on="Schedule">
        <button onClick={() => navigate("/schedules")}>スケジュール管理</button>
      </Can>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error : {error.message}</div>
      ) : (
        <div>whoAmI: {JSON.stringify(data.whoAmI)}</div>
      )}
    </div>
  );
}
