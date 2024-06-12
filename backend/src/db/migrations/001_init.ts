import { Kysely, sql } from "kysely";

const UID = "varchar(100)";
const BIG_VARVARCHAR = "varchar(255)";
const MEDIUM_VARVARCHAR = "varchar(100)";
const DATE = "datetime";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("uid", UID, (col) => col.primaryKey())
    .addColumn("email", BIG_VARVARCHAR, (col) => col.notNull())
    .addColumn("role", MEDIUM_VARVARCHAR, (col) => col.notNull())
    .addColumn("created_at", DATE, (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable("schedule")
    .addColumn("schedule_id", UID, (col) => col.primaryKey())
    .addColumn("date", MEDIUM_VARVARCHAR, (col) => col.notNull())
    .addColumn("time", MEDIUM_VARVARCHAR, (col) => col.notNull())
    .addColumn("member_id", UID, (col) => col.notNull())
    .addColumn("result_id", UID, (col) => col.defaultTo(null))
    .addColumn("created_at", DATE, (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("schedule").execute();
}
