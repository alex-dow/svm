import { Kysely } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>) {
    await db.schema.createTable("train_station")
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
    .execute();

    await db.schema.createTable("train_station_platform")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("mode", "text", (col) => col.notNull())
    .addColumn("position", "integer", (col) => col.notNull())
    .addColumn("train_station_id", "integer", (col) => 
        col.notNull()
        .references('train_station.id').onDelete('cascade')
    )
    .addColumn("owner_id", "text", (col) => 
        col.notNull()
        .references('user.id').onDelete('cascade')
    ).execute();

    await db.schema.createTable('train_station_platform_item')
    .addColumn('id', 'serial',(col) => col.primaryKey())
    .addColumn('item_id', 'text', (col) => col.notNull())
    .addColumn('rate', 'real', (col) => col.notNull())
    .addColumn('platform_id', 'integer', (col) => 
        col.notNull()
        .references('train_station_platform.id').onDelete('cascade')
    )
    .addColumn('owner_id', 'text', (col) =>
        col.notNull()
        .references('user.id').onDelete('cascade')
    )
    .execute();    
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>) {
    await db.schema.dropTable("train_station").execute();
    await db.schema.dropTable("train_station_platform").execute();
    await db.schema.dropTable('train_station_platform_item').execute();
}