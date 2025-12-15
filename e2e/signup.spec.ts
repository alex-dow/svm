import { test, expect } from "@playwright/test";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { MailpitClient } from "mailpit-api";
import { getDatabase } from "@/lib/db";
import { sql } from "kysely";

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
    await usernameInput.fill("testuser");
    const emailInput = page.locator("#signup-email");
    await emailInput.fill("test@example.com");
    const passwordInput = page.locator("#signup-password");
    await passwordInput.fill("password123");
    const confirmPasswordInput = page.locator("#signup-confirm-password");
    await confirmPasswordInput.fill("password123");
    const submitButton = page.locator("#signup-submit");
    await submitButton.click();

    await expect(page.locator("#signup-complete-container")).toBeVisible();

    //const emailMessage = await mailpit.getMessageSummary();

    //const successContainer = page.locator("#signup-complete-container");
    //await expect(successContainer).toBeVisible();

  });

  test("Prevents signup with existing username", async ({ page }) => {
    let usernameInput = page.locator("#signup-username");
    await usernameInput.fill("testuser2");
    const emailInput = page.locator("#signup-email");
    await emailInput.fill("test2@example.com");
    const passwordInput = page.locator("#signup-password");
    await passwordInput.fill("password123");
    const confirmPasswordInput = page.locator("#signup-confirm-password");
    await confirmPasswordInput.fill("password123");
    await confirmPasswordInput.blur();

    const submitButton = page.locator("#signup-submit");
    await submitButton.click();

    await expect(page.locator("#signup-complete-container")).toBeVisible();

    await page.goto("/");
    await page.goto("/signup");

    usernameInput = page.locator("#signup-username");
    await usernameInput.focus();
    await usernameInput.fill("testuser2");
    await usernameInput.blur();

    await expect(page.locator("#signup-username-error")).toBeVisible();
    await expect(page.locator("#signup-submit")).toBeDisabled();
  });
});