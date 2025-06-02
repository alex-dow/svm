import { config } from "dotenv";
config();

console.log(process.env);

import * as path from "path";
import { promises as fs } from "fs"
import { getDatabase } from "@/server/db";

import { FileMigrationProvider, Migrator } from "kysely";


async function migrateToLatest() {

    const db = getDatabase(process.env.DATABASE_URL as string);

    const dbUrl = new URL(process.env.DATABASE_URL as string);

    const protocol = dbUrl.protocol.replace(':','');

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.resolve(__dirname, "../src/server/db/migrations/", protocol)
        })
    });
    const { error, results } = await migrator.migrateToLatest();

    if (results) {
        results.forEach((result) => {
            if (result.status === 'Success') {
                console.log('Migration success: ' + result.migrationName);
            } else {
                console.warn('[warn] Migration error (' + result.status + '): ' + result.migrationName);
            }
        });
    }

    if (error) {
        console.error('[error] Failed to migrate');
        console.error(error)
        process.exit(1)
    }
}


migrateToLatest();