import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";

test.describe("Post-login Space creation", () => {
  test("should allow a logged-in user to create and view a new Space", async ({
    page,
  }) => {
    const spaceName = `QA Automation Space ${randomUUID().slice(0, 8)}`;
    const spaceDescription =
      "Created by Playwright to verify the core data-entry workflow.";

    // 1. Log in using credentials from environment variables
    await page.goto("/login");

    await page
      .getByLabel(/email/i)
      .fill(process.env.TEST_EMAIL as string);

    await page
      .getByLabel(/password/i)
      .fill(process.env.TEST_PASSWORD as string);

    await page.getByRole("button", { name: /log in|sign in/i }).click();

    // Verify that login succeeded
    await expect(page).not.toHaveURL(/\/login/);

    // 2. Navigate to the Space creation screen
    await page.getByRole("link", { name: /spaces|workspaces/i }).click();

    await page
      .getByRole("button", { name: /create|add|new space/i })
      .click();

    // 3. Enter the Space details
    await page
      .getByLabel(/space name|name/i)
      .fill(spaceName);

    await page
      .getByLabel(/description/i)
      .fill(spaceDescription);

    // 4. Save the Space
    await page
      .getByRole("button", { name: /^save$|^create$/i })
      .click();

    // 5. Verify the success message, if the application displays one
    const successMessage = page.getByText(
      /created successfully|space created|saved successfully/i
    );

    await expect(successMessage).toBeVisible();

    // 6. Verify that the newly created Space is searchable and displayed
    await page
      .getByRole("searchbox", { name: /search/i })
      .fill(spaceName);

    await expect(
      page.getByRole("link", { name: spaceName })
    ).toBeVisible();

    // 7. Open the Space and verify the saved description
    await page.getByRole("link", { name: spaceName }).click();

    await expect(page.getByText(spaceName)).toBeVisible();
    await expect(page.getByText(spaceDescription)).toBeVisible();
  });
});
