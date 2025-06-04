import { Kysely, PostgresDialect, SqliteDialect } from "kysely";
import SQLLite from 'better-sqlite3';
import { ProjectTable } from "./schemas/projects";
import { TrainStationPlatformItemTable, TrainStationPlatformTable, TrainStationTable } from "./schemas/trainStations";
import { TrainTable, TrainTimetableStopTable } from './schemas/trains';
import { AccountTable, SessionTable, UserTable, VerificationTable } from "./schemas/users";
import { Pool } from 'pg';

export interface SVMDatabase {
    project: ProjectTable,
    train_station: TrainStationTable,
    train_station_platform: TrainStationPlatformTable
    train_station_platform_item: TrainStationPlatformItemTable,
    train: TrainTable,
    train_timetable: TrainTimetableStopTable,
    user: UserTable,
    account: AccountTable,
    session: SessionTable,
    verification: VerificationTable
}

let db: Kysely<SVMDatabase>;

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
                log: ['query','error']
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
                log: ['error','query']
            });
            db = kysely;
        } else {
            throw new Error('Unknown database');
        }
    }

    return db;
}

