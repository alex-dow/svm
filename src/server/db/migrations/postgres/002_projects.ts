/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema.createTable("project")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("owner_id", "text", (col) => 
        col.notNull()
        .references('user.id').onDelete('cascade')
    )
    .execute();






}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("project").execute();
    


}