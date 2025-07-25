/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema.alterTable('user')
    .dropColumn('emailVerified')
    .execute();
    
    await db.schema.alterTable('user')
    .addColumn('emailVerified', 'varchar(6)', (col) => col.notNull().defaultTo('false'))
    .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.alterTable('user')
    .dropColumn('emailVerified')
    .execute();
    
    await db.schema.alterTable('user')
    .addColumn('emailVerified', 'integer', (col) => col.notNull())
    .execute();
}