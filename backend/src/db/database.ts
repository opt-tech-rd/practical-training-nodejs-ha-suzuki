import { v4 as uuid } from "uuid";

import { createPool } from "mysql2";
import { CamelCasePlugin, Kysely, MysqlDialect } from "kysely";
import { DB } from "kysely-codegen";
import { config } from "../config";

export const db = new Kysely<DB>({
  plugins: [new CamelCasePlugin()],
  dialect: new MysqlDialect({
    pool: createPool(config.db),
  }),
});

export async function getUser(uid: string) {
  return db
    .selectFrom("user")
    .selectAll()
    .where("uid", "=", uid)
    .executeTakeFirst();
}

export async function createUser(contextUser) {
  let user = await getUser(contextUser.uid);
  if (!user) {
    await db
      .insertInto("user")
      .values({
        uid: contextUser.uid,
        email: contextUser.email,
        role: "admin",
      })
      .executeTakeFirst();
    user = await getUser(contextUser.uid);
  }
  return user;
}

export async function updateUserRole(uid, role) {
  await db.updateTable("user").set({ role }).where("uid", "=", uid).execute();
  return db
    .selectFrom("user")
    .selectAll()
    .where("uid", "=", uid)
    .executeTakeFirst();
}

export async function getUsers(role) {
  return (
    db
      .selectFrom("user")
      .selectAll()
      // .$if(role === "member", (q) => q.where("role", "=", "member"))
      .orderBy("createdAt", "desc")
      .execute()
  );
}

export async function getSchedule(scheduleId: string) {
  return db
    .selectFrom("schedule")
    .selectAll()
    .where("scheduleId", "=", scheduleId)
    .executeTakeFirst();
}

export async function getSchedules(memberId: string) {
  return db
    .selectFrom("schedule")
    .select(["scheduleId", "date", "time", "resultId", "createdAt"])
    .where("memberId", "=", memberId)
    .execute();
}

export async function createSchedule(uid: string, date: string, time: string) {
  const scheduleId = uuid();
  let schedule = await getSchedule(scheduleId);
  if (!schedule) {
    await db
      .insertInto("schedule")
      .values({
        scheduleId: scheduleId,
        date: date,
        time: time,
        memberId: uid,
      })
      .executeTakeFirst();
    schedule = await getSchedule(scheduleId);
  }
  return schedule;
}
