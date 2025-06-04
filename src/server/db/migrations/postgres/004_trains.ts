import { Kysely } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>) {
    await db.schema.createTable("train")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("project_id", "integer", (col) => 
        col.notNull()
        .references('project.id').onDelete('cascade')
    )    
    .addColumn("owner_id", "text", (col) => 
        col.notNull()
        .references('user.id').onDelete('cascade')
    )
    .addColumn("wagons", "integer", (col) =>
        col.notNull().defaultTo(0)   
    )
    .execute();

    await db.schema.createTable('train_timetable_stop')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('consist_id', 'integer', (col) => 
        col.notNull()
        .references('train.id').onDelete('cascade')
    )
    .addColumn('station_id', 'integer', (col) =>
        col.notNull()
        .references('train_station.id').onDelete('cascade')
    )
    .addColumn('position', 'integer', (col) => col.notNull())
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>) {
    await db.schema.dropTable("train").execute();
    await db.schema.dropTable('train_timetable_stop').execute();
}