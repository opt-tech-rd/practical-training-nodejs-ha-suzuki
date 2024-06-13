import { Kysely, sql } from "kysely";

const UID = "varchar(100)";
const BIG_VARCHAR = "varchar(255)";
const MEDIUM_VARCHAR = "varchar(100)";
const DATE = "datetime";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("uid", UID, (col) => col.primaryKey())
    .addColumn("email", BIG_VARCHAR, (col) => col.notNull())
    .addColumn("role", MEDIUM_VARCHAR, (col) => col.notNull())
    .addColumn("created_at", DATE, (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable("schedule")
    .addColumn("schedule_id", UID, (col) => col.primaryKey())
    .addColumn("date", MEDIUM_VARCHAR, (col) => col.notNull())
    .addColumn("time", MEDIUM_VARCHAR, (col) => col.notNull())
    .addColumn("member_id", UID, (col) => col.notNull())
    .addColumn("result_id", UID, (col) => col.defaultTo(null))
    .addColumn("created_at", DATE, (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable("result")
    .addColumn("result_id", UID, (col) => col.primaryKey())
    .addColumn("schedule_id", UID, (col) => col.notNull())
    .addColumn("mentor_member_id", UID, (col) => col.notNull())
    .addColumn("mentee_member_id", UID, (col) => col.notNull())
    .addColumn("mentor_evaluation", "integer", (col) => col.notNull())
    .addColumn("mentee_evaluation", "integer", (col) => col.notNull())
    .addColumn("created_at", DATE, (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable("entry")
    .addColumn("entry_id", UID, (col) => col.primaryKey())
    .addColumn("schedule_id", MEDIUM_VARCHAR, (col) => col.notNull())
    .addColumn("member_id", UID, (col) => col.notNull())
    .addColumn("created_at", DATE, (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("schedule").execute();
  await db.schema.dropTable("result").execute();
  await db.schema.dropTable("entry").execute();
}
