/**
 * Script that initializes test containers before starting playwright tests
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import globalSetup from '../e2e/globalSetup';
import { migrateToLatest } from '../src/lib/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const command = process.argv[2] || 'test';

if (command === 'test') {
    console.log('[E2E - Wrapper] Initializing containers ... ');
    const { pgContainer, mailpitContainer } = await globalSetup();

    const smtpPort = mailpitContainer.getMappedPort(1025);
    const mailpitHttpPort = mailpitContainer.getMappedPort(8025);

    process.env.SMTP_HOST = 'localhost';
    process.env.SMTP_PORT = smtpPort.toString();
    process.env.SMTP_FROM = 'test@svm.com';
    process.env.SMTP_API_PORT = mailpitHttpPort.toString();

    const pguri = pgContainer.getConnectionUri();
    process.env.DATABASE_URL = pguri;

    console.log('[E2E - Wrapper] Environment variables:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_FROM:', process.env.SMTP_FROM);
    console.log('SMTP_API_PORT:', process.env.SMTP_API_PORT);
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    console.log('[E2E - Wrapper] Initialize database ... ');
    await migrateToLatest();

    console.log('[E2E - Wrapper] Starting playwright...');
    const playwrightProcess = spawn('npx', ['playwright', 'test', ...process.argv.slice(3)], {
        stdio: 'inherit',
        shell: true,
        cwd: join(__dirname, '..'),
        env: {...process.env}
    });

    playwrightProcess.on('close', (code) => {
        process.exit(code || 0);
    });
} else {
    console.error(`[E2E - Wrapper] Unknown command: ${command}`);
    process.exit(1);
}