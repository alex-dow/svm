/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema.alterTable('train_station_platform_item')
    .renameColumn('item_id','item_classname')
    .execute();

    await db.schema.alterTable('train_timetable_stop_item')
    .renameColumn('item_id','item_classname')
    .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.alterTable('train_station_platform_item')
    .renameColumn('item_classname','item_id')
    .execute();

    await db.schema.alterTable('train_timetable_stop_item')
    .renameColumn('item_classname','item_id')
    .execute();
}

