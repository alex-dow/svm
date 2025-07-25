/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";
import { CreateTrainNetworkItem } from "../../schemas/trains";

export async function up(db: Kysely<any>) {
    await db.schema.createTable('train_network_items')
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("item_classname", "text", (col) => col.notNull())
    .addColumn("project_id", "integer", (col) => 
        col.notNull()
        .references('project.id').onDelete('cascade')
    )    
    .addColumn("owner_id", "text", (col) => 
        col.notNull()
        .references('user.id').onDelete('cascade')
    )
    .addColumn('loading_rate', 'real', (col) => col.notNull().defaultTo(0))
    .addColumn('unloading_rate','real',(col) => col.notNull().defaultTo(0))
    .addColumn('availability', 'real', (col) => col.notNull().defaultTo(0))
    .addColumn('platform_position', 'integer', (col) => col.notNull())
    .execute();

    // populate table
    const users = await db.selectFrom('user').select('id').execute();
    for (const user of users) {
        const projects = await db.selectFrom('project').select('id').where('owner_id', '=', user.id).execute();
        for (const project of projects) {
            const stations = await db
                .selectFrom('train_station')
                .select('id')
                .where('project_id', '=', project.id).
                execute();

            let values = [] as CreateTrainNetworkItem[];

            for (const station of stations) {


                const items = await db.selectFrom('train_station_platform_item')
                .innerJoin('train_station_platform','train_station_platform_item.platform_id','train_station_platform.id')
                .innerJoin('train_station','train_station_platform.train_station_id','train_station.id')
                .select('train_station_platform_item.id as id')
                .select('train_station_platform_item.item_classname as item_classname')
                .select('train_station.id as station_id')
                .select('train_station_platform.mode as mode')
                .select('train_station_platform.position as position')
                .select('train_station_platform_item.rate as rate')
                .where('train_station.id','=',station.id)
                .where('train_station_platform_item.owner_id', '=', user.id)
                .execute();

                values = items.reduce((a, item) => {
                    const idx = a.findIndex((i) => i.item_classname === item.item_classname && i.platform_position === item.position);
                    
                    if (idx === -1) {
                        a.push({
                            project_id: project.id,
                            owner_id: user.id,
                            item_classname: item.item_classname,
                            loading_rate: (item.mode === 'loading') ? item.rate : 0,
                            unloading_rate: (item.mode === 'unloading') ? item.rate : 0,
                            availability: (item.mode === 'loading') ? item.rate : -item.rate,
                            platform_position: item.position,
                        })
                    } else {
                        a[idx].loading_rate += (item.mode === 'loading') ? item.rate : 0;
                        a[idx].unloading_rate += (item.mode === 'unloading') ? item.rate : 0;
                        a[idx].availability += (item.mode === 'loading') ? item.rate : -item.rate;
                    }
                    return a;
                }, values);
            }

            if (values.length > 0) {
                await db.insertInto('train_network_items').values(values).execute();
            }
        }
    }

    await db.schema.dropTable('train_station_platform_item');
}



export async function down(db: Kysely<any>) {

    await db.schema.dropTable('train_network_items');
}

