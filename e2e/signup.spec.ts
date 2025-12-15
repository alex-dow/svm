import { test, expect } from "@playwright/test";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { MailpitClient } from "mailpit-api";

test.describe("Login Workflow", () => {

console.log('env:', process.env);

  const mailpit: MailpitClient = new MailpitClient(
    `http://localhost:${process.env.SMTP_API_PORT}`,
  );
  test.beforeAll(async () => {
    await mailpit.deleteMessages();
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto("/signup");
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

    const emailMessage = await mailpit.getMessageSummary();

    console.log('--- EMAIL MESSAGE ---');
    console.log(emailMessage);

    const successContainer = page.locator("#signup-complete-container");
    await expect(successContainer).toBeVisible();

  });

  test("Prevents signup with existing username", async ({ page }) => {
    let usernameInput = page.locator("#signup-username");
    await usernameInput.fill("testuser2");
    const emailInput = page.locator("#signup-email");
    await emailInput.fill("test@example.com");
    const passwordInput = page.locator("#signup-password");
    await passwordInput.fill("password123");
    const confirmPasswordInput = page.locator("#signup-confirm-password");
    await confirmPasswordInput.fill("password123");
    const submitButton = page.locator("#signup-submit");
    await submitButton.click();

    await page.goto("/signup");

    usernameInput = page.locator("#signup-username");
    await usernameInput.fill("testuser2");
    await usernameInput.blur();

    await expect(page.locator("#signup-username-error")).toBeVisible();
    await expect(page.locator("#signup-submit")).toBeDisabled();
  });
});