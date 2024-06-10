import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useQuery, gql } from "@apollo/client";
import { Can } from "../casl";

const USERS = gql`
  query Users {
    users {
      uid
      email
      role
      createdAt
    }
  }
`;

export default function Users() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, error, data } = useQuery(USERS, {
    fetchPolicy: "no-cache",
  });

  return (
    <div>
      <h1>ユーザー管理ページ</h1>
      <div>
        ログイン中のユーザ:{" "}
        {JSON.stringify({ uid: user.uid, email: user.email })}
      </div>
      <h2>Users</h2>
      <div>
        <ul>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            data?.users.map((user, i) => {
              return (
                <li key={i}>
                  <div>user: {JSON.stringify(user)}</div>
                  <Can do="update" on="User">
                    <div>
                      <label htmlFor="role">role: </label>
                      <select
                        name="role"
                        defaultValue={user.role}
                        onChange={(event) => {
                          const newRole = event.target.value;

                        }}
                      ></select>
                    </div>
                  </Can>
                </li>
              );
            })
          )}
        </ul>
      </div>
      <button onClick={() => navigate("/")}>トップページ</button>
    </div>
  );
}
