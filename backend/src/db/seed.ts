import { DB } from "kysely-codegen";
import { db } from "./database";

const schedule1 = {
  scheduleId: "hogehogehoge",
  date: "2024-06-13",
  time: "11:05",
  member_id: "fugafugafuga",
};

const schedules = [schedule1];

async function seed() {
  const tables = (await db.introspection.getTables()).map(
    (t) => t.name as keyof DB
  );

  await Promise.all(tables.map((t) => db.deleteFrom(t as keyof DB).execute()));

  await db.insertInto("schedule").values(schedules).execute();

  await db.destroy();
}

seed();
