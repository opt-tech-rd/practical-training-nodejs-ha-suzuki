import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useQuery, gql } from "@apollo/client";

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
      <div>ログイン中: {user?.email}</div>
      <button
        onClick={() => {
          logout().then(() => {
            navigate("/login");
          });
        }}
      >
        ログアウト
      </button>
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
