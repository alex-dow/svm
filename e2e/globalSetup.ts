import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { PlaywrightTestConfig } from "playwright/test";
import { GenericContainer } from "testcontainers";

async function globalSetup() {
    const pgContainer = await new PostgreSqlContainer("postgres:latest")
    .withDatabase("svm_test")
    .withStartupTimeout(10000)
    .withExposedPorts(5432)
    .start();

    const pguri = pgContainer.getConnectionUri();
    console.log('[E2E - Global setup] PostgreSQL container started:', pguri);
    

    const mailpitContainer = await new GenericContainer("axllent/mailpit:latest")
    .withStartupTimeout(10000)
    .withExposedPorts(1025, 8025)
    .start();

    const mailpitHttpPort = mailpitContainer.getMappedPort(8025);
    console.log('[E2E - Global setup] Mailpit container started - SMTP PORT: ' + mailpitHttpPort + ' - API: : http://localhost:' + mailpitHttpPort);

    return {
        pgContainer,
        mailpitContainer,
    };
}

export default globalSetup;