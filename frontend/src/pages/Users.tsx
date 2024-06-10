import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Can, updateAbility } from "../casl";

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

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($uid: String!, $role: Role!) {
    updateUserRole(uid: $uid, role: $role) {
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
  const { loading, error, data, refetch } = useQuery(USERS, {
    fetchPolicy: "no-cache",
  });
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE, {
    onCompleted: () => refetch(),
  });

  return (
    <div>
      <h1>ユーザー管理ページ</h1>
      <div>
        ログイン中のユーザ:{" "}
        {JSON.stringify({ email: user.email })}
      </div>
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
                  <div>{JSON.stringify(user)}</div>
                  <Can do="update" on="User">
                    <div>
                      <label htmlFor="role">role: </label>
                      <select
                        name="role"
                        defaultValue={user.role}
                        onChange={(event) => {
                          const newRole = event.target.value;
                          updateUserRole({
                            variables: { uid: user.uid, role: newRole },
                          }).then(() => updateAbility());
                        }}
                      >
                        <option value={"admin"}>admin</option>
                        <option value={"member"}>member</option>
                      </select>
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
