/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema.createTable("project")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("owner_id", "text", (col) => 
        col.notNull()
        .references('user.id').onDelete('cascade')
    )
    .execute();

    await db.schema.createTable("train_station")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
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

    await db.schema.createTable("train_consist")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
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

    await db.schema.createTable("train_wagon")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("consist_id", "integer", (col) =>
        col.notNull()
        .references('train_consist.id').onDelete('cascade')
    )
    .addColumn('owner_id', 'text', (col) =>
        col.notNull()
        .references('user.id').onDelete('cascade')
    )
    .execute();    

    await db.schema.createTable('train_timetable')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('consist_id', 'integer', (col) => 
        col.notNull()
        .references('train_consists.id').onDelete('cascade')
    )
    .addColumn('station_id', 'integer', (col) =>
        col.notNull()
        .references('train_station.id').onDelete('cascade')
    )
    .addColumn('position', 'integer', (col) => col.notNull())
    .execute();    

    await db.schema.createTable("train_station_platform")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
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
    .addColumn('id', 'integer',(col) => col.primaryKey().autoIncrement())
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

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("project").execute();
    await db.schema.dropTable("train_station").execute();
    await db.schema.dropTable("train_consist").execute();
    await db.schema.dropTable("train_station_platform").execute();
    await db.schema.dropTable('train_station_platform_item').execute();
}