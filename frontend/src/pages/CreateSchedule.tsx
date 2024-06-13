import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Can, updateAbility } from "../casl";

export default function Create() {
  const navigate = useNavigate();
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  return (
    <div>
      <h1>スケジュール登録ページ</h1>
      <div>ログイン中のユーザ: {JSON.stringify({ email: user.email })}</div>
      <div>
        <label htmlFor="date">日付: </label>
        <input ref={dateRef} type="date"></input>
      </div>
      <div>
        <label htmlFor="time">時間: </label>
        <input ref={timeRef} type="time"></input>
      </div>
      <button
        onClick={() => {
          const date = dateRef.current?.value;
          const time = timeRef.current?.value;
          console.log(date, time);
        }}
      >
        登録
      </button>
    </div>
  );
}
