import { test, expect } from "@playwright/test";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { MailpitClient } from "mailpit-api";
import { getDatabase } from "@/lib/db";
import { sql } from "kysely";
import jsdom from 'jsdom';

test.describe("Login Workflow", () => {


  const mailpit: MailpitClient = new MailpitClient(
    `http://localhost:${process.env.SMTP_API_PORT}`,
  );
  test.beforeAll(async () => {
    await mailpit.deleteMessages();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");

    const db = getDatabase(process.env.DATABASE_URL);
    await sql`TRUNCATE TABLE "user" CASCADE`.execute(db);
    await sql`TRUNCATE TABLE account CASCADE`.execute(db);
    await sql`TRUNCATE TABLE session CASCADE`.execute(db);
    await sql`TRUNCATE TABLE verification CASCADE`.execute(db);
  });

  test("Successful signup", async ({ page }) => {

    const usernameInput = page.locator("#signup-username");
    const emailInput = page.locator("#signup-email");
    const passwordInput = page.locator("#signup-password");
    const confirmPasswordInput = page.locator("#signup-confirm-password");
    const submitButton = page.locator("#signup-submit");

    await usernameInput.focus();
    await usernameInput.fill("testuser");
    await page.keyboard.press('Tab');
    
    await expect(emailInput).toBeFocused();
    await emailInput.fill("test@example.com");
    await page.keyboard.press('Tab');
    
    await expect(passwordInput).toBeFocused();
    await passwordInput.fill("password123");
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Second tab is to skip the password visibility toggle

    await expect(confirmPasswordInput).toBeFocused();
    await confirmPasswordInput.fill("password123");
    
    
    await expect(submitButton).toBeEnabled();
    await page.keyboard.press('Enter');

    await expect(page.locator("#signup-complete-container")).toBeVisible();
    

    const emailMessage = await mailpit.getMessageSummary();
    console.log('[E2E - Signup] Email message:', emailMessage);

    const dom = new jsdom.JSDOM(emailMessage.HTML);
    const document = dom.window.document;
    const verifyLink = document.getElementById("verify-link");
    await expect(verifyLink).toBeTruthy();

    const verifyLinkUrl = verifyLink?.getAttribute("href");
    await expect(verifyLinkUrl).toBeTruthy();

    

    await page.goto(verifyLinkUrl as string);
    await expect(page.locator('#login-verified-message')).toBeVisible();


    //const successContainer = page.locator("#signup-complete-container");
    //await expect(successContainer).toBeVisible();

  });

});