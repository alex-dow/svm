import { nextDev } from 'next/dist/cli/next-dev.js';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import dotenv from 'dotenv';
import { migrateToLatest } from '../src/lib/db';
import { GenericContainer } from 'testcontainers';
dotenv.config({ path: '.env.test' });

async function startDevServer() {
    const pgurl = process.env.DATABASE_URL as string;
    const parsedUrl = new URL(pgurl);
    const username = parsedUrl.username;
    const password = parsedUrl.password;
    const host = parsedUrl.hostname;
    const port = parsedUrl.port;
    const database = parsedUrl.pathname.substring(1);
    
    
    const pgContainer = await new PostgreSqlContainer("postgres:latest")
    .withDatabase("svm_test")
    .withUsername(username)
    .withPassword(password)
    .withStartupTimeout(10000)
    .start();

    const pguri = pgContainer.getConnectionUri();
    process.env.DATABASE_URL = pguri;    
    console.log('[e2eserver] PostgreSQL container started:', pguri);

    const mailpitContainer = await new GenericContainer("axllent/mailpit:latest")
    .withExposedPorts({
        container: 1025,
        host: 1025
    },{
        container: 8025,
        host: 8025
    })
    .start();

    const smtpPort = mailpitContainer.getMappedPort(1025);
    const mailpitHttpPort = mailpitContainer.getMappedPort(8025);

    process.env.SMTP_HOST = 'localhost';
    process.env.SMTP_PORT = smtpPort.toString();
    process.env.SMTP_FROM = 'test@test.com';
    process.env.SMTP_API = 'http://localhost:' + mailpitHttpPort;

    console.log('[e2eserver] Mailpit container started: http://localhost:' + mailpitHttpPort);

    await migrateToLatest();
    
    await nextDev({
        port: 4000,
        hostname: 'localhost',
        disableSourceMaps: false
    },"cli");

}

startDevServer();
