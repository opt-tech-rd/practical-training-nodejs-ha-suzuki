import { sql } from "kysely";
const UID = "varchar(100)";
const BIG_VARVARCHAR = "varchar(255)";
const MEDIUM_VARVARCHAR = "varchar(100)";
const DATE = "datetime";
export async function up(db) {
    await db.schema
        .createTable("user")
        .addColumn("uid", UID, (col) => col.primaryKey())
        .addColumn("email", BIG_VARVARCHAR, (col) => col.notNull())
        .addColumn("role", MEDIUM_VARVARCHAR, (col) => col.notNull())
        .addColumn("created_at", DATE, (col) => col.defaultTo(sql `now()`).notNull())
        .execute();
}
export async function down(db) {
    await db.schema.dropTable("user").execute();
}
