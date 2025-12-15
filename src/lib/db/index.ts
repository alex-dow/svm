import { FileMigrationProvider, Kysely, Migrator, PostgresDialect, SqliteDialect } from "kysely";
import SQLLite from 'better-sqlite3';
import { ProjectTable } from "./schemas/projects";
import { TrainStationPlatformItemTable, TrainStationPlatformTable, TrainStationTable } from "./schemas/trainStations";
import { TrainNetworkItemTable, TrainTable, TrainTimetableStopItemTable, TrainTimetableStopTable } from './schemas/trains';
import { AccountTable, SessionTable, UserTable, VerificationTable } from "./schemas/users";
import { Pool } from 'pg';
import * as path from "path";
import { promises as fs } from "fs";

export interface SVMDatabase {
    project: ProjectTable,
    train_station: TrainStationTable,
    train_station_platform: TrainStationPlatformTable
    train_station_platform_item: TrainStationPlatformItemTable,
    train_network_items: TrainNetworkItemTable,
    train: TrainTable,
    train_timetable_stop: TrainTimetableStopTable,
    train_timetable_stop_item: TrainTimetableStopItemTable,
    user: UserTable,
    account: AccountTable,
    session: SessionTable,
    verification: VerificationTable
}

let db: Kysely<SVMDatabase> | null = null;

export function closeDatabase() {
    if (db) {
        db.destroy();
        db = null;
    }
}

export function getDatabase(dbUrl?: string): Kysely<SVMDatabase> {

    if (!db) {

        if (!dbUrl) {
            dbUrl = process.env.DATABASE_URL;
        }

        if (!dbUrl) {
            throw new Error("No DATABASE_URL avialable");
        }

        const parsedUrl = new URL(dbUrl);

        if (parsedUrl.protocol === "sqlite:") {

            const dialect = new SqliteDialect({
                database: new SQLLite(parsedUrl.pathname)
            });

            const kysely = new Kysely<SVMDatabase>({
                dialect,
                log: ['error', 'query']
            });

            db = kysely;
        } else if (parsedUrl.protocol === 'postgres:') {
            const dialect = new PostgresDialect({
                pool: new Pool({
                    database: parsedUrl.pathname.substring(1),
                    host: parsedUrl.hostname,
                    port: parseInt(parsedUrl.port),
                    user: parsedUrl.username,
                    password: parsedUrl.password,
                    ssl: parsedUrl.searchParams.get('sslmode') === 'require'

                })
            });

            const kysely = new Kysely<SVMDatabase>({
                dialect,
                log: ['error', 'query']
            });
            db = kysely;
        } else {
            throw new Error('Unknown database');
        }
    }

    return db;
}

export async function migrateToLatest() {
	const db = getDatabase(process.env.DATABASE_URL as string);
	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.resolve(import.meta.dirname, 'migrations', 'postgres')
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
		console.error(error);
		process.exit(1);
	}
}
