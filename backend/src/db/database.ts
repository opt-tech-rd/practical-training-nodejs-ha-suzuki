import { createPool } from "mysql2";
import { CamelCasePlugin, Kysely, MysqlDialect } from "kysely";
import { DB } from "kysely-codegen";
import { config } from "../config";

export const db = new Kysely<DB>({
  plugins: [new CamelCasePlugin()],
  dialect: new MysqlDialect({
    pool: createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    }),
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
  return db
    .selectFrom("user")
    .selectAll()
    .$if(role === "member", (q) => q.where("role", "=", "member"))
    .orderBy("createdAt", "desc")
    .execute();
}
